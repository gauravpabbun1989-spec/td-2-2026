#!/usr/bin/env node
/**
 * TicketDepart Growth Monitor
 * Owner-authorized, low-rate SEO/site-health audit. This is not a traffic generator.
 * Usage: node scripts/ticketdepart-growth-workers.mjs [https://ticketdepart.com]
 */
import { writeFile } from 'node:fs/promises';

const ORIGIN = new URL(process.argv[2] || 'https://ticketdepart.com');
const MAX_URLS = Math.max(1, Math.min(100, Number(process.env.MAX_URLS || 100)));
const CONCURRENCY = Math.max(1, Math.min(3, Number(process.env.CONCURRENCY || 3)));
const DELAY_MS = Math.max(500, Number(process.env.DELAY_MS || 1000));
const USER_AGENT = 'TicketDepartGrowthMonitor/1.0 (+site-owner SEO and availability audit)';
const PHONE = '+1-888-958-0280';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const safeText = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ').trim();
const first = (html, re) => (html.match(re)?.[1] || '').trim();

async function get(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xml,text/plain;q=0.9,*/*;q=0.5' }
    });
  } finally { clearTimeout(timeout); }
}
function locs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m => m[1].replace(/&amp;/g, '&'));
}
function allowedSameOrigin(raw) {
  try {
    const u = new URL(raw);
    return u.origin === ORIGIN.origin && /^https?:$/.test(u.protocol);
  } catch { return false; }
}

const report = {
  site: ORIGIN.origin,
  generatedAt: new Date().toISOString(),
  userAgent: USER_AGENT,
  limits: { maxUrls: MAX_URLS, concurrency: CONCURRENCY, delayMs: DELAY_MS },
  checks: [],
  summary: {}
};

try {
  const [robotsRes, sitemapRes] = await Promise.all([
    get(new URL('/robots.txt', ORIGIN)),
    get(new URL('/sitemap.xml', ORIGIN))
  ]);
  const robotsText = await robotsRes.text();
  const sitemapText = await sitemapRes.text();
  report.robots = { status: robotsRes.status, sitemapDirectives: robotsText.split(/\r?\n/).filter(l => /^\s*sitemap:/i.test(l)), disallowRules: robotsText.split(/\r?\n/).filter(l => /^\s*disallow:/i.test(l)).length };
  report.sitemap = { status: sitemapRes.status, contentType: sitemapRes.headers.get('content-type') || '' };

  let sitemapUrls = locs(sitemapText).filter(allowedSameOrigin);
  // Follow one level of sitemap indexes without crawling arbitrary external hosts.
  if (/sitemapindex/i.test(sitemapText)) {
    const childUrls = sitemapUrls.slice(0, 20);
    sitemapUrls = [];
    for (const child of childUrls) {
      try {
        const res = await get(child);
        if (res.ok) sitemapUrls.push(...locs(await res.text()).filter(allowedSameOrigin));
      } catch (error) {
        report.checks.push({ type: 'sitemap-child', url: child, error: String(error) });
      }
      await sleep(DELAY_MS);
    }
  }
  sitemapUrls = [...new Set(sitemapUrls)].slice(0, MAX_URLS);
  report.sitemap.urlCountAudited = sitemapUrls.length;

  let cursor = 0;
  async function worker(workerId) {
    while (true) {
      const index = cursor++;
      if (index >= sitemapUrls.length) return;
      const url = sitemapUrls[index];
      const item = { worker: workerId, url, checkedAt: new Date().toISOString() };
      try {
        const res = await get(url);
        item.status = res.status;
        item.finalUrl = res.url;
        item.contentType = res.headers.get('content-type') || '';
        if (item.contentType.includes('text/html')) {
          const html = await res.text();
          item.title = safeText(first(html, /<title\b[^>]*>([\s\S]*?)<\/title>/i)).slice(0, 180);
          item.h1Count = [...html.matchAll(/<h1\b/gi)].length;
          item.canonical = first(html, /<link\b[^>]*rel=[\"']canonical[\"'][^>]*href=[\"']([^\"']+)/i)
            || first(html, /<link\b[^>]*href=[\"']([^\"']+)[\"'][^>]*rel=[\"']canonical[\"']/i);
          item.metaRobots = first(html, /<meta\b[^>]*name=[\"']robots[\"'][^>]*content=[\"']([^\"']*)/i)
            || first(html, /<meta\b[^>]*content=[\"']([^\"']*)[\"'][^>]*name=[\"']robots[\"']/i);
          item.hasPublicPhone = html.includes(PHONE) || html.includes('888-958-0280');
          item.hasCallLink = /href=[\"']tel:/i.test(html);
          item.issues = [];
          if (!res.ok) item.issues.push('http-not-ok');
          if (!item.title) item.issues.push('missing-title');
          if (!item.h1Count) item.issues.push('missing-h1');
          if (/noindex/i.test(item.metaRobots)) item.issues.push('meta-noindex');
          if (!item.canonical) item.issues.push('missing-canonical');
          if (!item.hasPublicPhone) item.issues.push('public-phone-not-found');
          if (!item.hasCallLink) item.issues.push('tel-link-not-found');
        } else {
          item.issues = res.ok ? [] : ['http-not-ok'];
        }
      } catch (error) {
        item.error = String(error);
        item.issues = ['request-failed'];
      }
      report.checks.push(item);
      await sleep(DELAY_MS);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));
  const issueCounts = {};
  for (const check of report.checks) for (const issue of (check.issues || [])) issueCounts[issue] = (issueCounts[issue] || 0) + 1;
  report.summary = {
    urlsChecked: report.checks.length,
    urlsWithIssues: report.checks.filter(c => c.issues?.length || c.error).length,
    issueCounts,
    note: 'Audit requests are monitoring traffic, not customer visits. No GA4 events are generated.'
  };
} catch (error) {
  report.fatalError = String(error);
  process.exitCode = 1;
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const output = `ticketdepart-growth-audit-${stamp}.json`;
await writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ output, site: report.site, summary: report.summary, fatalError: report.fatalError }, null, 2));

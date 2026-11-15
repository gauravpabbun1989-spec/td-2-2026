/**
 * Compile-time compatibility for the MCP SDK's Node Buffer declaration.
 * Cloudflare Workers use Uint8Array-compatible byte buffers.
 * This declaration adds no runtime implementation.
 */
type Buffer = Uint8Array;

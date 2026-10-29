# Central phone-number control

**Single source of truth:** `config/phone-number.json`

When the business phone number changes:
1. Update `display` and `tel` in `config/phone-number.json`.
2. Put every previous display format in `legacy` (for example, both `+1-800-555-0100` and `+18005550100` if both formats exist in the repository).
3. From `src/frontend`, run `pnpm phone:replace`.
4. Review the diff and run the build, tests, and phone-number audit before deployment.

The sync script replaces legacy formats in tracked-style text files in the current checkout. It skips build output, dependencies, lockfiles, binary files, and its own config. Review its diff before committing.

## Branch behavior

Git branches are separate snapshots. The central config and command become available on a branch after this change is merged or cherry-picked into that branch. After that, running `pnpm phone:replace` on the branch synchronizes its text files. A change to one branch cannot automatically rewrite every remote branch unless a separate branch-sync automation is configured and authorized; do not assume an unmerged branch has received the change.

# GitHub Pages Static Publishing

This repository keeps the local Prisma-backed admin app as the editing source of truth and publishes a public-only static site to GitHub Pages.

## Local Publish Flow

1. Start the local database and app.
2. Edit content in the local admin.
3. Export the public snapshot:

   ```bash
   NODE_ENV=development ALLOW_LOCAL_STATIC_EXPORT=1 npm run static:export
   ```

4. Verify the static build without database access:

   ```bash
   npm run static:verify
   ```

5. Review the diff for `src/content/generated/**`, `public/generated/media/**`, and any source changes.
6. Commit and push to `main`.

## GitHub Setup

The repository must be public for this account plan. Pages is configured to use **Build and deployment > Source: GitHub Actions**. The workflow at `.github/workflows/pages.yml` runs typecheck, tests, `static:verify`, uploads `out/`, and deploys to `https://parsaoryani.github.io/`.

Current deployment:

- Latest commit: `72d26dd`
- Latest successful Pages run: `32590189995`
- Live URL: `https://parsaoryani.github.io/`
- Verified response: HTTP 200

Check deployment status:

```bash
gh run list --workflow pages.yml --limit 5
gh api repos/parsaoryani/parsaoryani.github.io/pages
```

## Rollback

Rollback is a normal Git rollback:

1. Revert the content/media/source commit that produced the bad Pages artifact.
2. Push the revert to `main`.
3. Wait for the Pages workflow to finish.
4. Confirm `https://parsaoryani.github.io/` shows the restored content.

For an emergency redeploy of a previous successful Actions artifact, use GitHub's Pages deployment history in the repository UI.

## Custom Domain

For a custom domain, keep `NEXT_PUBLIC_BASE_PATH=""`, set `NEXT_PUBLIC_SITE_URL` to the custom origin in the workflow, add the domain in **Settings > Pages**, and commit the generated `CNAME` file if GitHub creates one. Re-run `npm run static:verify` before pushing.

## Troubleshooting

- `Pages API: current plan does not support GitHub Pages`: make the repository public or upgrade to a plan that supports Pages for private repositories.
- `DATABASE_URL` errors in CI: the workflow must not regenerate DB content; run `static:export` locally and commit the generated JSON/media first.
- Broken local asset: add the file under `public/` or update the exported content to an external URL.
- Contact form appears in static output: `static:prepare` did not swap the contact surface; rerun `npm run static:verify` and inspect `.static-export-workspace`.
- `/personalWebsite` appears in output: remove old base-path values and rebuild with `NEXT_PUBLIC_BASE_PATH=""`.

## Notes

- GitHub Actions must not receive `DATABASE_URL` or admin/storage/email secrets.
- The static build uses committed JSON and committed `public/` assets only.
- The local export command is gated by `NODE_ENV=development` and `ALLOW_LOCAL_STATIC_EXPORT=1`.
- Do not use Git LFS for Pages assets.
- Current coursework file links that point to GitHub remain external navigation links; committed root-relative assets are validated during `static:verify`.
- Remote HTTPS asset mirroring is intentionally left as a post-launch hardening item; use root-relative committed assets or `/uploads/**` assets for export-managed media today.

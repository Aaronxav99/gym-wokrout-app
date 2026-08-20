# Training Ledger Enhancement Queue

- [x] Restructure the workflow as plan, selected workout day, then individual exercises.
- [x] Add an explicit per-set **Done** control after weight and repetitions are entered.
- [x] Allow the workout date to be chosen manually, prefilled with today’s local date.
- [x] Add detailed day and week narratives describing completed exercises, sets, repetitions, and volume.
- [x] Export detailed workout and progress data to a locally downloaded Excel-compatible workbook.
- [x] Export the body-weight/progress chart as a locally downloaded image.
- [x] Export the underlying workout and progress records as a local data file.
- [x] Validate the enhanced flows on desktop and mobile, then deliver an updated checkpoint.

## GitHub Pages Deployment and Phone Access

- [x] Add GitHub Pages deployment configuration for a public phone-accessible URL.
- [x] Add concise repository, GitHub Pages, and phone installation instructions.
- [x] Export the project to the user’s own GitHub repository after confirmation of the target visibility and account.

## GitHub Pages Routing Fix

- [x] Configure the client router to account for the `/gym-wokrout-app/` GitHub Pages base path.
- [x] Push the routing correction and confirm that the public repository URL opens the dashboard rather than the in-app 404 screen.
- [x] Move pnpm setup ahead of Node cache setup in the GitHub Pages workflow, then confirm the account-enabled deployment succeeds.

## Personal Accounts and Private Cloud Data

- [x] Upgrade the project to provide secure authentication and database storage.
- [x] Create user-scoped workout, plan, exercise, and body-weight records so each account can only access its own data.
- [x] Add sign-in, account creation, sign-out, and protected application access states.
- [x] Preserve the existing local-download export options while adding cloud sync across devices.
- [x] Add confirmed History controls to delete either one completed exercise or an entire workout day, and synchronize the deletion privately.

## Small-Group Free-Tier Evaluation

- [x] Compare free or low-cost authentication and database services that are suitable for a small private workout group.
- [x] Recommend the simplest option that works alongside the current GitHub-hosted frontend.

## Supabase Personal Accounts and Cloud Sync

- [x] Add Supabase browser client configuration using safe public project settings.
- [x] Create private user-scoped tables and row-level security policies for training data.
- [x] Add email-and-password sign-up, sign-in, sign-out, and protected record access.
- [x] Synchronize workout, plan, exercise, progress, and body-weight records for the signed-in user.
- [x] Document the required Supabase project configuration and GitHub Pages environment values.
- [ ] Enforce a maximum of two personal accounts through the Supabase database, rather than relying on a browser-only limit.
- [x] Provide a normal-browser cache recovery path so older pre-account app copies cannot mask the current login screen.

## Supabase Update Package and Publication

- [x] Package the account-enabled project source without generated dependencies or build artifacts.
- [x] Provide Windows CMD commands to merge the update, commit it, push it, and test a first personal account.

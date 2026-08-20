# Connect Training Ledger to Supabase

Training Ledger can remain on GitHub Pages while Supabase manages account sign-in and each user’s private cloud record. The browser configuration uses the **Project URL** and the **publishable/anon key** only. These values are designed to be public; never add the `service_role` or any secret key to this repository.

## 1. Create the free project

Create a project at [Supabase](https://supabase.com/dashboard). In the project’s **SQL Editor**, create a new query, paste the complete contents of `supabase/schema.sql`, and run it. The query creates one user-scoped record per account and applies row-level security so users can only read or change their own record.

## 2. Configure email login

In **Authentication → Providers**, keep Email enabled. In **Authentication → URL Configuration**, set the Site URL to `https://aaronxav99.github.io/gym-wokrout-app/` and add the same address as a Redirect URL. Email confirmation is recommended for a private group.

## 3. Add public browser settings

Open `client/public/supabase-config.js` and replace the empty values with the Project URL and the **publishable** key from **Project Settings → API**. Commit and push the change to GitHub. The key is safe to expose only because the SQL policies in this project restrict every row to its signed-in owner.

```js
window.__TRAINING_LEDGER_SUPABASE__ = {
  url: "https://your-project-ref.supabase.co",
  publishableKey: "your-publishable-or-anon-key",
};
```

## 4. Verify the private account flow

After GitHub Pages finishes deploying, open the app in a private browser window. Create an account, confirm the email if Supabase requests it, sign in, add a workout, refresh the page, and then sign in on a second device. The same records should appear. Each user receives an independent row in `training_records`.

> The free tier is appropriate for a small group, but free project limits and inactivity behavior can change. Export the record locally from the Progress page as an additional backup.

## 5. Restrict account creation to you, or to you plus one person

The app can show the account-creation screen to a visitor, but browser code must never be trusted to decide who may register. To enforce access in Supabase itself, open **SQL Editor → New query**, open `supabase/restrict-to-approved-emails.sql`, replace `replace-with-your-email@example.com` with your existing account email, and run the complete query. That makes the site **owner-only** for all future registrations.

To allow exactly one additional person, also uncomment the second `insert` statement and replace its placeholder with that person’s email before running the query. Only the listed addresses can then create a new account; everyone else receives a rejected registration. Do not place passwords, service-role keys, or any other secret in this SQL file.

> Supabase allows new-user creation to be disabled globally, and its documentation cautions that a failing `auth.users` trigger can block sign-ups. This project uses a narrow before-insert trigger deliberately, so test the permitted second email in an incognito browser after you run the query.[1]

## References

[1]: https://supabase.com/docs/guides/auth/managing-user-data "Supabase — User Management"

# Training Ledger on GitHub Pages

This repository is ready for a **static GitHub Pages deployment**. The included workflow builds the React application whenever you push to the `main` branch and publishes the resulting site to GitHub Pages.

## What GitHub Pages provides

GitHub Pages gives you a public address in this form:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME/
```

Open that address on your phone. On iPhone, use **Share → Add to Home Screen**. On Android Chrome, use the browser menu and choose **Install app** or **Add to Home screen**.

## Publish from your GitHub repository

Create or push this project to a GitHub repository. In the repository, open **Settings → Pages** and set the source to **GitHub Actions**. Then push to the `main` branch. The action in `.github/workflows/deploy-pages.yml` will build and publish the site.

## Important data behavior

GitHub Pages hosts the frontend only. Training Ledger remains local-first in this mode: your workouts, body weight, and plans are stored in the browser on that phone. Use **Progress → Download Excel** or **Download data** for a local backup. The data will not automatically sync between your phone and computer until a hosted backend and sign-in system are added.

## Optional future API connection

The included FastAPI/SQLite companion backend is not part of GitHub Pages. If you later host that backend separately, configure `VITE_WORKOUT_API_URL` in the GitHub Actions environment to point to its public `/api/v1` URL. Until then, the application safely uses its browser-local training record.

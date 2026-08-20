# GitHub Pages Cache Notes

After the successful account-enabled deployment on 20 August 2026, the public root document briefly referenced an older hashed JavaScript bundle and showed a blank page. A cache-busted request then returned the current document and valid assets, which rendered the sign-in screen normally.

GitHub’s Pages deployment issue discussion notes that asset-cache invalidation can take roughly ten minutes to propagate globally and that repeated requests can temporarily preserve a cached 404 response. When a new Pages deployment appears blank after a successful workflow, test a cache-busted URL such as `https://aaronxav99.github.io/gym-wokrout-app/?v=<new-version>` before changing application code.

Source: https://github.com/actions/deploy-pages/issues/86

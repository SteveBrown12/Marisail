## Workflow

Modules developed by different developers should be pushed to the `test` branch. Once their functionality is verified, the administrator will manually merge them into the `main` branch.

### Notes

- **Pre-verification:** Ensure that the modules have been tested locally before being pushed. Modules will be automatically integrated into the server via a test deployment.
- **Module errors:** If the module doesn't work as expected, it could affect the test deployment. In that case, you should fix the error in your module as soon as possible or revert the push to the `test` branch while addressing the issue.
- **Deployment time:** After pushing to the `test` branch, the server will take approximately 1 minute to reflect the changes in the test environment.
- **Test access:** You can access the Marisail test service at the following URL: [https://test.marisail.com](https://test.marisail.com).



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugin are availables:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

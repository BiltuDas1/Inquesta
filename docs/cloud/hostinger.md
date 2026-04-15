# Deploying to Hostinger (Staging)

> [!important]  
> In Hostinger, you need at least Business Plan to deploy shared Node.js web application

- [Deploying to Hostinger (Staging)](#deploying-to-hostinger-staging)
  - [Deploying the code](#deploying-the-code)
  - [Setup Github Actions (For Staging Environment)](#setup-github-actions-for-staging-environment)

## Deploying the code

- Open the Hostinger hpanel, and then goes to Website section
- Create a new Website and select Node.js as the environment
- Create a new subdomain (e.g. `api.example.com`)
- Now open the [server](../../server/) folder and then create a zip file containing all the items

  > [!warning]
  > Do not zip anything sensitive like `.env` or any temporary folder like `node_modules` or build folders like `dist`

- Now upload the zip file and then continue
- In the environment section do the following settings:
  - Framework Preset: Other
  - Node Version: 24
  - Build Command: `npm run build`
  - Package Manager: npm
  - Output directory: `dist`
  - Entry file: `dist/server.js`
  - [Environment Variables](../environment.md#environment-variables-graphql)
- And now deploy it and wait for the deploy to get finished

## Setup Github Actions (For Staging Environment)

The [hostinger.yml](../../.github/workflows/hostinger.yml) handles auto deploy for a staging environment. When you will push your code to default branch, it will build the code and then push it to your hostinger using SSH. Also it would check whether the hostinger code is latest or not by checking the last commit hash and store it in hostinger.

> [!important]
> For the SSH Facility, you need to [enable the SSH in the Hostinger](https://www.hostinger.com/support/1583645-how-to-enable-ssh-access-in-hostinger/) and also generate a fresh [SSH Private and Public Key (EdDSA)](https://www.hostinger.com/in/tutorials/how-to-set-up-ssh-keys) and link it with Hostinger.

You need to add the following Action Secrets in order to make the whole CI functional:

| Secret Name  | Description                                                                           |
| ------------ | ------------------------------------------------------------------------------------- |
| `API_DOMAIN` | Consist the Staging [FQDN](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) |
| `SSH_HOST`   | The host address for SSH Connection                                                   |
| `SSH_POST`   | The port for SSH Connectivity                                                         |
| `SSH_USER`   | The SSH username                                                                      |
| `SSH_KEY`    | The SSH Private Key which public key you have linked with Hostinger                   |

Now you can manually trigger the workflow in github action to see the deployment

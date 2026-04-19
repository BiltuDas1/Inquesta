# Environment Variables (GraphQL)

| Name                   | Description                                                                                      | Required           |
| ---------------------- | ------------------------------------------------------------------------------------------------ | ------------------ |
| `PRODUCTION`           | Setting this environment would leads to detect the current environment as Production Environment | Only On Production |
| `MYSQL_URI`            | The connection URI of the MySQL Instance                                                         | :white_check_mark: |
| `ORIGINS`              | The Base URLs which would call the GraphQL API, Seperated by commas                              | Only On Production |
| `RESEND_API_KEY`       | Resend.com API Key for sending email                                                             | :white_check_mark: |
| `REDIS_URI`            | The Connection URI of the Redis Database                                                         | :white_check_mark: |
| `EDDSA_PRIVATE_KEY`    | Private key used to sign Access Tokens (JWT)                                                     | :white_check_mark: |
| `GOOGLE_CLIENT_ID`     | The client ID of the Google OAuth 2.0 Application                                                | :white_check_mark: |
| `GOOGLE_CLIENT_SECRET` | The client secret of the Google OAuth 2.0 Application                                            | :white_check_mark: |

# Environment Variables (Frontend)

| Name                            | Description                                                            | Required           |
| ------------------------------- | ---------------------------------------------------------------------- | ------------------ |
| `VITE_API_URL`                  | The connection URI of the backend endpoint(GraphQL)                    | :white_check_mark: |
| `VITE_GOOGLE_CLIENT_ID`         | The client ID of the Google OAuth 2.0 Application                      | :white_check_mark: |
| `VITE_GOOGLE_AUTH_REDIRECT_URL` | The redirection url which will be redirect after Google Authentication | :white_check_mark: |

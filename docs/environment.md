# Environment Variables (GraphQL)

| Name                   | Description                                                                                      | Required           |
| ---------------------- | ------------------------------------------------------------------------------------------------ | ------------------ |
| `PRODUCTION`           | Setting this environment would leads to detect the current environment as Production Environment | Only On Production |
| `MYSQL_URI`            | The connection URI of the MySQL Instance                                                         | :white_check_mark: |
| `ORIGINS`              | The Base URLs which would call the GraphQL API, Seperated by commas                              | Only On Production |
| `RESEND_API_KEY`       | Resend.com API Key for sending email                                                             | :white_check_mark: |
| `REDIS_URI`            | The Connection URI of the Redis Database                                                         | :white_check_mark: |
| `ACCESS_PRIVATE_KEY`   | Private key used to sign Access Tokens (JWT)                                                     | :white_check_mark: |
| `ACCESS_PUBLIC_KEY`    | Public key used to verify Access Tokens                                                          | :white_check_mark: |
| `ACCESS_TOKEN_EXPIRY`  | Expiry time for Access Token (in seconds, e.g., 900 = 15 min)                                    | :white_check_mark: |
| `REFRESH_PRIVATE_KEY`  | Private key used to sign Refresh Tokens (JWT)                                                    | :white_check_mark: |
| `REFRESH_PUBLIC_KEY`  | Public key used to verify Refresh Tokens                                                         | :white_check_mark: |
| `REFRESH_TOKEN_EXPIRY` | Expiry time for Refresh Token (in seconds, e.g., 604800 = 7 days)                                | :white_check_mark: |

# Environment Variables (Frontend)

| Name           | Description                                         | Required           |
| -------------- | --------------------------------------------------- | ------------------ |
| `VITE_API_URL` | The connection URI of the backend endpoint(GraphQL) | :white_check_mark: |

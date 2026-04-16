# Environment Variables (GraphQL)

| Name             | Description                                                                                      | Required           |
| ---------------- | ------------------------------------------------------------------------------------------------ | ------------------ |
| `PRODUCTION`     | Setting this environment would leads to detect the current environment as Production Environment | Only On Production |
| `MYSQL_URI`      | The connection URI of the MySQL Instance                                                         | :white_check_mark: |
| `ORIGINS`        | The Base URLs which would call the GraphQL API, Seperated by commas                              | Only On Production |
| `RESEND_API_KEY` | Resend.com API Key for sending email                                                             | :white_check_mark: |


# Environment Variables (Frontend)
| Name           | Description                                         | Required           |
| -------------- | --------------------------------------------------- | ------------------ |
| `VITE_API_URL` | The connection URI of the backend endpoint(GraphQL) | :white_check_mark: |

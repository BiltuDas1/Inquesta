# User Authentication & Login API Documentation

This document describes the GraphQL queries and mutations associated with the user login, session management, and authentication flows.

All successful login mutations place two Secure, HttpOnly cookies on the client's HTTP response headers:
1. `access_token`: A short-lived JWT token used to authorize requests.
2. `refresh_token`: A long-lived token stored in Redis, used to renew the access token.

---

## 1. Mutation: `login`

### Description
Authenticates a user via email and password. Upon successful verification:
1. Generates a fresh JWT `access_token` and `refresh_token`.
2. Sets both tokens as HTTP-only cookies in the response headers.
3. Returns user profile details including their assigned role.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `email` | `String` | **Mandatory** | The registered user's email address. |
| `password` | `String` | **Mandatory** | The account password. |

### Return Payload (`LoginResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Indicates whether authentication succeeded. |
| `message` | `String` | **Required** | Details about the login attempt. |
| `data` | `UserRole` | Optional | Returned on success, containing user details. |

#### `UserRole` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `firstname` | `String` | **Required** | User's first name. |
| `lastname` | `String` | Optional | User's last name. |
| `email` | `String` | **Required** | User's email. |
| `role` | `String` | **Required** | The user's role (e.g. `"student"`, `"parent"`, `"teacher"`, `"admin"`). |

### Code Examples

#### GraphQL Request
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    success
    message
    data {
      firstname
      lastname
      email
      role
    }
  }
}
```

#### Variables
```json
{
  "email": "jane.doe@example.com",
  "password": "SecurePassword123!"
}
```

#### Expected JSON Response (Success)
```json
{
  "data": {
    "login": {
      "success": true,
      "message": "login successful",
      "data": {
        "firstname": "Jane",
        "lastname": "Doe",
        "email": "jane.doe@example.com",
        "role": "student"
      }
    }
  }
}
```

#### Expected JSON Response (Failure)
```json
{
  "data": {
    "login": {
      "success": false,
      "message": "login failed",
      "data": null
    }
  }
}
```

---

## 2. Mutation: `loginWithGoogle`

### Description
Authenticates a user via Google OAuth2.
1. The frontend passes a Google authorization code.
2. The server exchanges this code for Google tokens.
3. The user is logged in (and registered if they do not yet exist).
4. Generates and sets `access_token` and `refresh_token` cookies.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `code` | `String` | **Mandatory** | The authorization code received from the Google OAuth2 flow. |

### Return Payload (`LoginResponse`)
Same structure as the `login` mutation return payload.

### Code Examples

#### GraphQL Request
```graphql
mutation LoginWithGoogle($code: String!) {
  loginWithGoogle(code: $code) {
    success
    message
    data {
      firstname
      lastname
      email
      role
    }
  }
}
```

#### Variables
```json
{
  "code": "4/0AdQt8qg..."
}
```

#### Expected JSON Response (Success)
```json
{
  "data": {
    "loginWithGoogle": {
      "success": true,
      "message": "login successful",
      "data": {
        "firstname": "Jane",
        "lastname": "Doe",
        "email": "jane.doe@example.com",
        "role": "student"
      }
    }
  }
}
```

---

## 3. Mutation: `refreshJWT`

### Description
Refreshes the active user session.
1. Reads the `refresh_token` from the cookies.
2. If verified, issues a new set of `access_token` and `refresh_token` cookies.
3. If verification fails, it clears both cookie values from the client's browser.

### Input Parameters
None. (Relies on HTTP request cookies).

### Return Payload (`MutationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Indicates whether token refresh was successful. |
| `message` | `String` | **Required** | Details of the refresh outcome. |

### Code Examples

#### GraphQL Request
```graphql
mutation RefreshSession {
  refreshJWT {
    success
    message
  }
}
```

#### Expected JSON Response (Success)
```json
{
  "data": {
    "refreshJWT": {
      "success": true,
      "message": "token refreshed successfully"
    }
  }
}
```

---

## 4. Mutation: `logoutUser`

### Description
Logs out the current user by:
1. Deleting their active `refresh_token` from Redis.
2. Clearing the `access_token` and `refresh_token` cookies from the browser.

### Input Parameters
None.

### Return Payload (`MutationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Indicates whether logout succeeded. |
| `message` | `String` | **Required** | Confirmation message. |

### Code Examples

#### GraphQL Request
```graphql
mutation Logout {
  logoutUser {
    success
    message
  }
}
```

#### Expected JSON Response (Success)
```json
{
  "data": {
    "logoutUser": {
      "success": true,
      "message": "successfully logged out"
    }
  }
}
```

---

## 5. Query: `isLoggedIn`

### Description
An authenticated query that checks if the client currently has a valid session. It parses the incoming `access_token` cookie and returns basic information about the user.

### Input Parameters
None.

### Return Payload (`UserLoginResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if a valid session exists. |
| `message` | `String` | **Required** | Description of the session status. |
| `data` | `UserLoginResponseData` | Optional | Returned if logged in. |

#### `UserLoginResponseData` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `firstname` | `String` | **Required** | User's first name. |
| `lastname` | `String` | Optional | User's last name (can be `null`). |
| `role` | `String` | **Required** | User's role (e.g. `"student"`, `"parent"`, `"teacher"`, `"admin"`). |

### Code Examples

#### GraphQL Request
```graphql
query CheckLoginStatus {
  isLoggedIn {
    success
    message
    data {
      firstname
      lastname
      role
    }
  }
}
```

#### Expected JSON Response (Authenticated / Success)
```json
{
  "data": {
    "isLoggedIn": {
      "success": true,
      "message": "valid login",
      "data": {
        "firstname": "Jane",
        "lastname": "Doe",
        "role": "student"
      }
    }
  }
}
```

#### Expected JSON Response (Unauthenticated)
```json
{
  "data": {
    "isLoggedIn": {
      "success": false,
      "message": "invalid access token",
      "data": null
    }
  }
}
```

# User Registration API Documentation

This document describes the GraphQL mutations associated with the user registration and verification flows.

---

## 1. Mutation: `register`

### Description
Registers a new user (student or parent) in the system. The backend:
1. Hashes the user's password using Argon2.
2. Inserts the user record into the database with `isActive` set to `false` (or `true` if mock testing is enabled).
3. Sets the user's role to `"student"` if `is_student` is `true`, otherwise `"parent"`.
4. If mock testing is disabled, generates a verification token, saves the email-token mapping in Redis (expires in 10 minutes), and sends a verification link to the user's email.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `firstname` | `String` | **Mandatory** | The user's first name. |
| `lastname` | `String` | Optional | The user's last name. |
| `email` | `String` | **Mandatory** | A unique email address used as the primary login identifier. |
| `password` | `String` | **Mandatory** | The plain text password to be hashed and stored. |
| `is_student` | `Boolean` | **Mandatory** | `true` if the user is a student; `false` if they are a parent. |

### Return Payload (`MutationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Indicates whether the registration request succeeded. |
| `message` | `String` | **Required** | Informational message detailing the outcome of the registration. |

### Code Examples

#### GraphQL Request
```graphql
mutation RegisterUser($firstname: String!, $lastname: String, $email: String!, $password: String!, $is_student: Boolean!) {
  register(
    firstname: $firstname
    lastname: $lastname
    email: $email
    password: $password
    is_student: $is_student
  ) {
    success
    message
  }
}
```

#### Variables
```json
{
  "firstname": "Jane",
  "lastname": "Doe",
  "email": "jane.doe@example.com",
  "password": "SecurePassword123!",
  "is_student": true
}
```

#### Expected JSON Response (Mock Testing Enabled / Success)
```json
{
  "data": {
    "register": {
      "success": true,
      "message": "registration complete"
    }
  }
}
```

#### Expected JSON Response (Standard Email Sent)
```json
{
  "data": {
    "register": {
      "success": true,
      "message": "An email has been sent to jane.doe@example.com"
    }
  }
}
```

#### Expected JSON Response (Duplicate Email Error)
```json
{
  "data": {
    "register": {
      "success": false,
      "message": "Email already registered"
    }
  }
}
```

---

## 2. Mutation: `verifyEmail`

### Description
Verifies a user's email address using a temporary URL-safe verification token. Upon success, the user account's `isActive` flag is set to `true`, allowing them to log in.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `token` | `String` | **Mandatory** | The verification token sent to the user's email. |

### Return Payload (`VerifyEmailResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Indicates whether the verification was successful. |
| `message` | `String` | **Required** | Explains the result of the verification attempt. |
| `data` | `VerifyEmailData` | Optional | Returned on success, containing the verified user's email. |

#### `VerifyEmailData` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `email` | `String` | **Required** | The verified email address. |

### Code Examples

#### GraphQL Request
```graphql
mutation VerifyUserEmail($token: String!) {
  verifyEmail(token: $token) {
    success
    message
    data {
      email
    }
  }
}
```

#### Variables
```json
{
  "token": "4a5efb26c7104d49a37e193bd350a89d"
}
```

#### Expected JSON Response (Success)
```json
{
  "data": {
    "verifyEmail": {
      "success": true,
      "message": "email verified successfully",
      "data": {
        "email": "jane.doe@example.com"
      }
    }
  }
}
```

#### Expected JSON Response (Expired / Invalid Token)
```json
{
  "data": {
    "verifyEmail": {
      "success": false,
      "message": "invalid or expired token",
      "data": null
    }
  }
}
```

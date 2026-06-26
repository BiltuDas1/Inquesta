# Notifications API Documentation

This document describes the GraphQL queries and mutations associated with the system broadcast notifications.

---

## Query: `getNotifications`

### Description
Retrieves personal system notification alerts targeted to the currently authenticated user.

### Input Parameters
None. (Requires session cookies).

### Return Payload (`NotificationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Success status. |
| `message` | `String` | **Required** | Status details. |
| `data` | `[Notification]` | Optional | List of notifications. |

#### `Notification` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `title` | `String` | **Required** | Notification header title. |
| `description` | `String` | **Required** | Description body content. |

### Code Examples

#### GraphQL Request
```graphql
query GetNotifications {
  getNotifications {
    success
    message
    data {
      title
      description
    }
  }
}
```

#### Expected JSON Response (Success)
```json
{
  "data": {
    "getNotifications": {
      "success": true,
      "message": "notifications fetched successfully",
      "data": [
        {
          "title": "Welcome to Inquesta",
          "description": "We are glad to have you here!"
        }
      ]
    }
  }
}
```

---

## Mutation: `sendNotification`

### Description
Sends a broadcast notification targeted to a specific user role (or all users if role is omitted).

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `title` | `String` | **Mandatory** | Notification title. |
| `description` | `String` | **Mandatory** | Notification details. |
| `role` | `String` | Optional | Target user role (e.g. `"student"`). |

### Return Payload (`MutationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if broadcast was successfully sent. |
| `message` | `String` | **Required** | Message details. |

### Code Examples

#### GraphQL Request
```graphql
mutation SendNotification($title: String!, $description: String!, $role: String) {
  sendNotification(title: $title, description: $description, role: $role) {
    success
    message
  }
}
```

#### Variables
```json
{
  "title": "Maintenance Alert",
  "description": "The server will be down for 2 hours on Sunday.",
  "role": "student"
}
```

#### Expected JSON Response
```json
{
  "data": {
    "sendNotification": {
      "success": true,
      "message": "notification broadcasted successfully"
    }
  }
}
```

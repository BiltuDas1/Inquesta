# Notices API Documentation

This document describes the GraphQL queries and mutations associated with the public bulletin board notices.

---

## Query: `getNotices`

### Description
Fetches all public bulletin board notices.

### Input Parameters
None.

### Return Payload (`NoticesResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Success status. |
| `message` | `String` | **Required** | Message details. |
| `data` | `[Notice]` | Optional | List of notices. |

#### `Notice` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Notice ID. |
| `title` | `String` | **Required** | Title of the notice. |
| `imagePath` | `String` | **Required** | Path to the notice image. |
| `description` | `String` | **Required** | Full content description of the notice. |
| `badge` | `String` | Optional / Nullable | Text tag badge (e.g. `"New"`). |
| `isActive` | `Boolean` | **Required** | Publish visibility status. |

### Code Examples

#### GraphQL Request
```graphql
query GetNotices {
  getNotices {
    success
    message
    data {
      id
      title
      imagePath
      description
      badge
      isActive
    }
  }
}
```

#### Expected JSON Response (Success)
```json
{
  "data": {
    "getNotices": {
      "success": true,
      "message": "notices fetched successfully",
      "data": [
        {
          "id": "notice-id-123",
          "title": "Summer Holidays",
          "imagePath": "/assets/notices/summer.png",
          "description": "School will remain closed for summer break from July 1st.",
          "badge": "Important",
          "isActive": true
        }
      ]
    }
  }
}
```

---

## Mutation: `addNotice`

### Description
Adds a new public bulletin board notice.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `title` | `String` | **Mandatory** | Notice title. |
| `description` | `String` | **Mandatory** | Notice body description. |
| `badge` | `String` | Optional | Badge label tag. |
| `image` | `String` | **Mandatory** | File image path or URL. |
| `isActive` | `Boolean` | **Mandatory** | Visibility status active flag. |

### Return Payload (`MutationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if notice was created. |
| `message` | `String` | **Required** | Informational message. |

### Code Examples

#### GraphQL Request
```graphql
mutation AddNotice($title: String!, $description: String!, $badge: String, $image: String!, $isActive: Boolean!) {
  addNotice(title: $title, description: $description, badge: $badge, image: $image, isActive: $isActive) {
    success
    message
  }
}
```

#### Variables
```json
{
  "title": "Parent-Teacher Meeting",
  "description": "PTM scheduled for next Saturday.",
  "badge": "Event",
  "image": "ptm.png",
  "isActive": true
}
```

#### Expected JSON Response
```json
{
  "data": {
    "addNotice": {
      "success": true,
      "message": "Notice added successfully"
    }
  }
}
```

---

## Mutation: `updateNotice`

### Description
Updates an existing bulletin notice.

### Input Parameters
All arguments in `addNotice` plus `id` (String!, **Mandatory**).

### Return Payload (`MutationResponse`)
Same structure as `addNotice`.

---

## Mutation: `deleteNotice`

### Description
Removes a notice by ID.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Mandatory** | Notice ID to delete. |

### Return Payload (`MutationResponse`)
Same structure as `addNotice`.

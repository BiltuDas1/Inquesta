# Course Shopping Cart API Documentation

This document describes the GraphQL queries and mutations associated with managing a student's course shopping cart.

---

## Query: `getCartItems`

### Description
Retrieves a list of courses currently present in the authenticated user's shopping cart.

### Input Parameters
None. (Requires user session cookies).

### Return Payload (`CartItemsResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if request succeeded. |
| `message` | `String` | **Required** | Explains the result of the query. |
| `data` | `[Course]` | Optional | List of courses in the cart. |

#### `Course` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Unique course ID. |
| `title` | `String` | **Required** | Title of the course. |
| `icon` | `String` | **Required** | Icon name/identifier. |
| `description` | `String` | Optional / Nullable | Course description details. |
| `price` | `Float` | **Required** | Price of the course. |
| `level` | `String` | **Required** | Course level (`"beginner"`, `"intermediate"`, `"advanced"`). |
| `duration` | `String` | **Required** | Duration estimate (e.g., `"12 weeks"`). |
| `instructorName` | `String` | **Required** | Instructor teaching the course. |
| `slug` | `String` | **Required** | URL-friendly course slug. |
| `teacherId` | `String` | Optional / Nullable | Assigned teacher user ID. |
| `status` | `String` | Optional / Nullable | Course status. |

### Code Examples

#### GraphQL Request
```graphql
query GetCartItems {
  getCartItems {
    success
    message
    data {
      id
      title
      price
      level
      instructorName
    }
  }
}
```

#### Expected JSON Response (Success)
```json
{
  "data": {
    "getCartItems": {
      "success": true,
      "message": "items retrieved successfully",
      "data": [
        {
          "id": "course-id-101",
          "title": "Introduction to GraphQL",
          "price": 49.99,
          "level": "beginner",
          "instructorName": "John Doe"
        }
      ]
    }
  }
}
```

---

## Mutation: `addCourseToCart`

### Description
Adds a course to the student's shopping cart.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | **Mandatory** | The ID of the course to add. |

### Return Payload (`MutationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if item was added. |
| `message` | `String` | **Required** | Action detail message. |

### Code Examples

#### GraphQL Request
```graphql
mutation AddToCart($courseId: String!) {
  addCourseToCart(courseId: $courseId) {
    success
    message
  }
}
```

#### Variables
```json
{
  "courseId": "course-id-101"
}
```

#### Expected JSON Response
```json
{
  "data": {
    "addCourseToCart": {
      "success": true,
      "message": "course added to cart"
    }
  }
}
```

---

## Mutation: `removeCourseFromCart`

### Description
Removes a course from the student's shopping cart.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | **Mandatory** | The ID of the course to remove. |

### Return Payload (`MutationResponse`)
Same structure as `addCourseToCart`.

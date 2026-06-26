# Timetable API Documentation

This document describes the GraphQL queries and mutations associated with student schedules/timetables.

---

## 1. Query: `getTimetable`

### Description
Retrieves all schedule/timetable entries for the currently authenticated user.

### Input Parameters
None. (Requires user session cookies).

### Return Payload (`TimetableResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Success status. |
| `message` | `String` | **Required** | Detail message. |
| `data` | `[TimetableEntry]` | Optional | List of user's timetable entries. |

#### `TimetableEntry` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Entry unique ID. |
| `userId` | `String` | **Required** | Owner's user ID. |
| `subject` | `String` | **Required** | Subject/Class name. |
| `day` | `String` | **Required** | Day of the week (e.g. `"Monday"`). |
| `startHour` | `Int` | **Required** | Start time hour (e.g. `9`). |
| `durationHours` | `Int` | **Required** | Duration in hours. |
| `room` | `String` | Optional / Nullable | Room number or location. |
| `colorClass` | `String` | Optional / Nullable | CSS theme class name for display colors. |
| `eventType` | `String` | Optional / Nullable | Event classification type. |

### Code Examples

#### GraphQL Request
```graphql
query GetTimetable {
  getTimetable {
    success
    message
    data {
      id
      userId
      subject
      day
      startHour
      durationHours
      room
      colorClass
      eventType
    }
  }
}
```

#### Expected JSON Response (Success)
```json
{
  "data": {
    "getTimetable": {
      "success": true,
      "message": "timetable entries fetched successfully",
      "data": [
        {
          "id": "entry-id-1",
          "userId": "user-student-1",
          "subject": "Mathematics",
          "day": "Monday",
          "startHour": 9,
          "durationHours": 2,
          "room": "Room 101",
          "colorClass": "bg-blue-500",
          "eventType": "class"
        }
      ]
    }
  }
}
```

---

## 2. Mutation: `addTimetableEntry`

### Description
Creates a new schedule entry in the user's timetable.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `subject` | `String` | **Mandatory** | Subject name. |
| `day` | `String` | **Mandatory** | Day of the week. |
| `startHour` | `Int` | **Mandatory** | Start hour (24-hour format). |
| `durationHours` | `Int` | Optional | Duration in hours. |
| `room` | `String` | Optional | Location/room. |
| `colorClass` | `String` | Optional | Visual card styling color class. |
| `eventType` | `String` | Optional | Type (e.g. `"class"`, `"exam"`). |

### Return Payload (`MutationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if entry was successfully added. |
| `message` | `String` | **Required** | Success message detail. |

### Code Examples

#### GraphQL Request
```graphql
mutation AddTimetableEntry($subject: String!, $day: String!, $startHour: Int!, $durationHours: Int, $room: String, $colorClass: String, $eventType: String) {
  addTimetableEntry(subject: $subject, day: $day, startHour: $startHour, durationHours: $durationHours, room: $room, colorClass: $colorClass, eventType: $eventType) {
    success
    message
  }
}
```

#### Variables
```json
{
  "subject": "Physics",
  "day": "Tuesday",
  "startHour": 11,
  "durationHours": 1,
  "room": "Lab B",
  "colorClass": "bg-red-500",
  "eventType": "lab"
}
```

#### Expected JSON Response
```json
{
  "data": {
    "addTimetableEntry": {
      "success": true,
      "message": "timetable entry added successfully"
    }
  }
}
```

---

## 3. Mutation: `deleteTimetableEntry`

### Description
Deletes a specific timetable entry by its ID.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Mandatory** | The unique ID of the entry to remove. |

### Return Payload (`MutationResponse`)
Same structure as `addTimetableEntry`.

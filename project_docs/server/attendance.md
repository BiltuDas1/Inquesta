# Student Attendance API Documentation

This document describes the GraphQL queries and mutations associated with tracking student attendance.

---

## 1. Query: `getTeacherCourses`

### Description
Retrieves a list of courses allocated to the currently logged-in teacher for the purpose of taking attendance.

### Input Parameters
None. (Requires user session cookies).

### Return Payload (`TeacherCoursesResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Indicates request success status. |
| `message` | `String` | **Required** | Informational message. |
| `data` | `[AttendanceCourse]` | Optional | List of courses allocated to the teacher. |

#### `AttendanceCourse` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Unique course ID. |
| `title` | `String` | **Required** | Title of the course. |
| `level` | `String` | **Required** | Target education level of the course. |

---

## 2. Query: `getCourseStudents`

### Description
Retrieves all students enrolled in a specific course, used to display an attendance checklist.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | **Mandatory** | The ID of the course. |

### Return Payload (`CourseStudentsResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if success. |
| `message` | `String` | **Required** | Message details. |
| `data` | `[AttendanceStudent]` | Optional | List of enrolled students. |

#### `AttendanceStudent` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Student's user ID. |
| `firstname` | `String` | **Required** | Student's first name. |
| `lastname` | `String` | Optional / Nullable | Student's last name. |
| `email` | `String` | **Required** | Student's email. |

---

## 3. Query: `getAttendanceByDate`

### Description
Retrieves the attendance records for a specific course on a given date. Useful for viewing or editing historical attendance.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | **Mandatory** | The ID of the course. |
| `date` | `String` | **Mandatory** | The date string (e.g. `YYYY-MM-DD`). |

### Return Payload (`CourseAttendanceResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if successful. |
| `message` | `String` | **Required** | Details. |
| `data` | `[CourseAttendanceRecord]` | Optional | Detailed attendance records for that day. |

#### `CourseAttendanceRecord` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Unique attendance entry ID. |
| `userId` | `String` | **Required** | User ID of the student. |
| `status` | `String` | **Required** | Attendance status (e.g. `"present"`, `"absent"`). |

---

## 4. Query: `getAttendanceLogs`

### Description
Retrieves aggregated attendance metrics for each class date under a course, including count of present students vs total students.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | **Mandatory** | The ID of the course. |

### Return Payload (`AttendanceLogsResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Success status. |
| `message` | `String` | **Required** | Message details. |
| `data` | `[AttendanceLog]` | Optional | List of daily summaries. |

#### `AttendanceLog` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `date` | `String` | **Required** | Log date. |
| `presentCount` | `Int` | **Required** | Number of students marked present. |
| `totalCount` | `Int` | **Required** | Total student count on that day. |

---

## 5. Mutation: `submitAttendance`

### Description
Submits or updates the attendance status sheet for all students in a course for a given date.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | **Mandatory** | Course ID. |
| `date` | `String` | **Mandatory** | Date string (e.g., `YYYY-MM-DD`). |
| `records` | `[AttendanceRecordInput!]` | **Mandatory** | Array of attendance records. |

#### `AttendanceRecordInput` Structure
| Field Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `String` | **Mandatory** | Student's ID. |
| `status` | `String` | **Mandatory** | Status (`"present"`, `"absent"`, or `"late"`). |

### Return Payload (`MutationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if submission succeeded. |
| `message` | `String` | **Required** | Success message. |

### Code Examples

#### GraphQL Request
```graphql
mutation SubmitAttendance($courseId: String!, $date: String!, $records: [AttendanceRecordInput!]!) {
  submitAttendance(courseId: $courseId, date: $date, records: $records) {
    success
    message
  }
}
```

#### Variables
```json
{
  "courseId": "019058b3-c152-7b0a-9d21-f3b18d8b6711",
  "date": "2026-06-26",
  "records": [
    { "userId": "user-student-1", "status": "present" },
    { "userId": "user-student-2", "status": "absent" }
  ]
}
```

#### Expected JSON Response
```json
{
  "data": {
    "submitAttendance": {
      "success": true,
      "message": "attendance registered successfully"
    }
  }
}
```

---

## 6. Query: `getStudentAttendance`

### Description
Retrieves a detailed list of attendance records for the currently authenticated student.

### Input Parameters
None.

### Return Payload (`StudentAttendanceResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if success. |
| `message` | `String` | **Required** | Message details. |
| `data` | `[StudentAttendanceRecord]` | Optional | List of attendance entries. |

#### `StudentAttendanceRecord` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Unique attendance log ID. |
| `courseId` | `String` | **Required** | Reference course ID. |
| `date` | `String` | **Required** | The log date. |
| `status` | `String` | **Required** | Status (`"present"`, `"absent"`, etc.). |

# Assignments and Resources API Documentation

This document describes the GraphQL queries and mutations associated with the creation, retrieval, submission, grading, and management of assignments and course resources.

---

## 1. Query: `getTeacherAssignments`

### Description
Retrieves all assignments created by the currently authenticated teacher.

### Input Parameters
None. (Requires an authenticated session containing the user's `access_token` in cookies).

### Return Payload (`GetTeacherAssignmentsResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Indicates whether the query was successful. |
| `message` | `String` | **Required** | Informational message. |
| `data` | `[TeacherAssignmentInfo]` | Optional | List of assignments for the teacher. |

#### `TeacherAssignmentInfo` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Unique identifier for the assignment. |
| `courseName` | `String` | **Required** | Name of the course this assignment belongs to. |
| `assignmentName` | `String` | **Required** | Name/Title of the assignment. |
| `assignmentDescription` | `String` | **Required** | Details or prompt of the assignment. |
| `creationDate` | `String` | **Required** | Date the assignment was created. |
| `dueDate` | `String` | Optional / Nullable | Deadline for submission. |
| `totalSubmission` | `Int` | **Required** | Total number of student submissions received. |
| `isPublished` | `Boolean` | **Required** | Whether the assignment is visible to students. |

### Code Examples

#### GraphQL Request
```graphql
query GetTeacherAssignments {
  getTeacherAssignments {
    success
    message
    data {
      id
      courseName
      assignmentName
      assignmentDescription
      creationDate
      dueDate
      totalSubmission
      isPublished
    }
  }
}
```

#### Expected JSON Response (Success)
```json
{
  "data": {
    "getTeacherAssignments": {
      "success": true,
      "message": "Assignments retrieved successfully",
      "data": [
        {
          "id": "019058b3-c152-7b0a-9d21-f3b18d8b6711",
          "courseName": "Introduction to Computer Science",
          "assignmentName": "Homework 1",
          "assignmentDescription": "Solve exercises 1-5 in chapter 1.",
          "creationDate": "2026-06-25T10:00:00Z",
          "dueDate": "2026-07-02T23:59:59Z",
          "totalSubmission": 5,
          "isPublished": true
        }
      ]
    }
  }
}
```

---

## 2. Mutation: `addAssignment`

### Description
Creates a new assignment for a specific course.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | **Mandatory** | The ID of the course. |
| `title` | `String` | **Mandatory** | The title of the assignment. |
| `description` | `String` | **Mandatory** | Details of the assignment. |
| `dueDate` | `String` | Optional | Due date and time (e.g. ISO string). |
| `isPublished` | `Boolean` | Optional | Publish status (defaults to `false`). |

### Return Payload (`MutationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if creation succeeded. |
| `message` | `String` | **Required** | Message detail. |

### Code Examples

#### GraphQL Request
```graphql
mutation AddAssignment($courseId: String!, $title: String!, $description: String!, $dueDate: String, $isPublished: Boolean) {
  addAssignment(courseId: $courseId, title: $title, description: $description, dueDate: $dueDate, isPublished: $isPublished) {
    success
    message
  }
}
```

#### Variables
```json
{
  "courseId": "019058b3-c152-7b0a-9d21-f3b18d8b6711",
  "title": "Lab 1",
  "description": "Submit your code for Lab 1 here.",
  "dueDate": "2026-07-05T23:59:00Z",
  "isPublished": true
}
```

#### Expected JSON Response
```json
{
  "data": {
    "addAssignment": {
      "success": true,
      "message": "Assignment created successfully"
    }
  }
}
```

---

## 3. Mutation: `updateAssignment`

### Description
Updates an existing assignment's parameters.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Mandatory** | The ID of the assignment to update. |
| `title` | `String` | Optional | The updated title. |
| `description` | `String` | Optional | The updated description. |
| `dueDate` | `String` | Optional | The updated due date. |
| `isPublished` | `Boolean` | Optional | The updated publish status. |

### Return Payload (`MutationResponse`)
Same structure as `addAssignment`.

---

## 4. Mutation: `deleteAssignment`

### Description
Deletes an assignment by its ID.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Mandatory** | The ID of the assignment to delete. |

### Return Payload (`MutationResponse`)
Same structure as `addAssignment`.

---

## 5. Query: `getAssignmentSubmissions`

### Description
Retrieves submissions and grading status of all students enrolled in the course for a specific assignment. Used by teachers to grade submissions.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `assignmentId` | `String` | **Mandatory** | The ID of the assignment. |

### Return Payload (`GetAssignmentSubmissionsResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if request succeeded. |
| `message` | `String` | **Required** | Details. |
| `data` | `[AssignmentStudentDetail]` | Optional | List of student submissions. |

#### `AssignmentStudentDetail` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `studentId` | `String` | **Required** | Unique ID of the student. |
| `studentName` | `String` | **Required** | Full name of the student. |
| `studentEmail` | `String` | **Required** | Email of the student. |
| `studentPhone` | `String` | Optional / Nullable | Student's phone number. |
| `studentPhoneCountryCode` | `Int` | Optional / Nullable | Country code of phone number. |
| `status` | `String` | **Required** | Submission status (e.g. `"pending"`, `"submitted"`, `"graded"`). |
| `score` | `Int` | **Required** | Assigned grade score. |

---

## 6. Mutation: `updateStudentSubmission`

### Description
Updates the submission grading status and score for a specific student's assignment.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `assignmentId` | `String` | **Mandatory** | The ID of the assignment. |
| `studentId` | `String` | **Mandatory** | The ID of the student. |
| `status` | `String` | Optional | Updated status (e.g., `"graded"`, `"returned"`). |
| `score` | `Int` | Optional | Updated score. |

### Return Payload (`MutationResponse`)
Same structure as `addAssignment`.

---

## 7. Query: `getStudentAssignments`

### Description
Retrieves all assignments relevant to the currently logged-in student, along with their submission status and score.

### Input Parameters
None.

### Return Payload (`GetStudentAssignmentsResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if request succeeded. |
| `message` | `String` | **Required** | Description. |
| `data` | `[StudentAssignmentInfo]` | Optional | List of student assignments. |

#### `StudentAssignmentInfo` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Unique ID for the assignment. |
| `courseName` | `String` | **Required** | Name of the course. |
| `assignmentTitle` | `String` | **Required** | Title of the assignment. |
| `assignmentDescription` | `String` | **Required** | Description of the assignment. |
| `creationDate` | `String` | **Required** | Assignment creation date. |
| `dueDate` | `String` | Optional / Nullable | Assignment due date. |
| `status` | `String` | **Required** | Student submission status. |
| `score` | `Int` | **Required** | Student's grade. |

---

## 8. Mutation: `updateStudentAssignmentStatus`

### Description
Allows a student to mark/update their assignment status (e.g., set status to `"submitted"`).

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `assignmentId` | `String` | **Mandatory** | The ID of the assignment. |
| `status` | `String` | **Mandatory** | The new status (e.g. `"submitted"`). |

### Return Payload (`MutationResponse`)
Same structure as `addAssignment`.

---

## 9. Query: `getResources`

### Description
Retrieves learning resources for all courses, or filtered by a specific `courseId` if provided.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | Optional | Filter resources by a specific course. |

### Return Payload (`ResourcesResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if successful. |
| `message` | `String` | **Required** | Message details. |
| `data` | `[Resource]` | Optional | List of resources. |

#### `Resource` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Unique resource ID. |
| `courseId` | `String` | Optional / Nullable | Course ID reference. |
| `title` | `String` | **Required** | Resource title. |
| `type` | `String` | **Required** | Type of resource (e.g., `"pdf"`, `"video"`, `"link"`). |
| `url` | `String` | **Required** | URL path to access the resource file. |
| `description` | `String` | Optional / Nullable | Description of the resource. |

---

## 10. Mutation: `addResource`

### Description
Adds a new resource to a course.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | Optional | Course ID link. |
| `title` | `String` | **Mandatory** | Title of the resource. |
| `type` | `String` | **Mandatory** | Resource format (e.g., `"pdf"`). |
| `url` | `String` | **Mandatory** | File url. |
| `description` | `String` | Optional | Additional details. |

### Return Payload (`MutationResponse`)
Same structure as `addAssignment`.

---

## 11. Mutation: `updateResource`

### Description
Updates parameters of an existing resource.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Mandatory** | Resource ID. |
| `courseId` | `String` | Optional | Course ID link. |
| `title` | `String` | **Mandatory** | Updated title. |
| `type` | `String` | **Mandatory** | Updated type. |
| `url` | `String` | **Mandatory** | Updated URL. |
| `description` | `String` | Optional | Updated description. |

### Return Payload (`MutationResponse`)
Same structure as `addAssignment`.

---

## 12. Mutation: `deleteResource`

### Description
Deletes a resource by its ID.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Mandatory** | The ID of the resource to delete. |

### Return Payload (`MutationResponse`)
Same structure as `addAssignment`.

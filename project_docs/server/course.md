# Courses and Curriculum API Documentation

This document describes the GraphQL queries and mutations associated with managing courses, student enrollments, curriculum units, and course takeaways.

---

## 1. Query: `courseGet`

### Description
Fetches a list of courses from the platform. Supports cursor-based pagination, level filtering, price cap filtering, and status filtering.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `limit` | `Int` | **Mandatory** | The maximum number of course records to fetch. |
| `lastID` | `String` | Optional | Cursor ID for pagination. |
| `levels` | `[String!]` | Optional | Array of course levels to filter (e.g. `["beginner", "advanced"]`). |
| `maxPrice` | `Int` | Optional | Maximum price filter. |
| `status` | `String` | Optional | Course status (e.g. `"published"`). |

### Return Payload (`CourseResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if request succeeded. |
| `message` | `String` | **Required** | Message details. |
| `data` | `[Course]` | Optional | List of courses matching the query criteria. |

---

## 2. Query: `getCourseInfo`

### Description
Retrieves full details of a course by its unique URL-friendly slug.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `slug` | `String` | **Mandatory** | Unique course URL slug. |

### Return Payload (`SingleCourseResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if course details were retrieved. |
| `message` | `String` | **Required** | Message detail. |
| `data` | `Course` | Optional | Course details object. |

---

## 3. Query: `searchCourses`

### Description
Fuzzy searches courses by title or description using a search text string with pagination and filter criteria.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `text` | `String` | **Mandatory** | Search text query. |
| `limit` | `Int` | **Mandatory** | Maximum records to return. |
| `lastRelevance` | `Float` | Optional | Cursor relevancy score for search pagination. |
| `lastID` | `String` | Optional | Cursor ID for pagination. |
| `levels` | `[String!]` | Optional | List of levels to filter. |
| `maxPrice` | `Int` | Optional | Price ceiling limit. |
| `status` | `String` | Optional | Status to filter. |

### Return Payload (`SearchedCourseResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if search completed. |
| `message` | `String` | **Required** | Description message. |
| `data` | `[SearchableCourse]` | Optional | List of matching searchable courses with relevance score. |

#### `SearchableCourse` Fields
All standard `Course` fields, plus:
* `relevance`: `Float` (Relevancy score matching search term)

---

## 4. Query: `enrolledCourses`

### Description
Retrieves a list of courses in which the currently authenticated student is enrolled.

### Input Parameters
None.

### Return Payload (`CourseResponse`)
Same structure as `courseGet`.

---

## 5. Query: `getallEnrollments`

### Description
Admin query to fetch all course enrollment transactions across the platform.

### Input Parameters
None.

### Return Payload (`CoursesResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Success status. |
| `message` | `String` | **Required** | Details message. |
| `data` | `[CourseEnrollment]` | Optional | List of all system enrollments. |

#### `CourseEnrollment` Fields
Contains student contact/qualification info, course detail details, `transaction_id`, `enrolled_at` timestamp, and enrollment `status`.

---

## 6. Query: `getTeacherAllocatedCourses`

### Description
Retrieves courses along with their assigned teachers.

### Input Parameters
None.

### Return Payload (`GetTeacherAllocatedCoursesResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if retrieval succeeded. |
| `message` | `String` | **Required** | Message description. |
| `data` | `[TeacherAllocatedCourse]` | Optional | List of allocated courses. |

#### `TeacherAllocatedCourse` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | **Required** | Course ID. |
| `courseTitle` | `String` | **Required** | Title of the course. |
| `teacherId` | `String` | Optional / Nullable | Assigned teacher ID. |
| `teacherName` | `String` | Optional / Nullable | Name of the teacher. |
| `teacherEmail` | `String` | Optional / Nullable | Email of the teacher. |

---

## 7. Mutation: `courseAdd`

### Description
Creates/registers a new course in the system.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `title` | `String` | **Mandatory** | Course title. |
| `description` | `String` | Optional | Course description details. |
| `price` | `Int` | **Mandatory** | Numeric price value. |
| `level` | `String` | **Mandatory** | Course level (`"beginner"`, `"intermediate"`, `"advanced"`). |
| `duration` | `String` | **Mandatory** | Time duration length. |
| `instructor_name` | `String` | **Mandatory** | Assigned instructor display name. |
| `icon_name` | `String` | Optional | Icon glyph identifier. |
| `teacher_id` | `String` | Optional | Associated teacher user ID. |
| `status` | `String` | Optional | Initial course status. |

### Return Payload (`MutationResponse`)
True if course creation succeeded.

---

## 8. Mutation: `courseUpdate`

### Description
Modifies course info properties.

### Input Parameters
All parameters in `courseAdd`, plus `id` (String!, **Mandatory**).

### Return Payload (`MutationResponse`)
True if update succeeded.

---

## 9. Mutation: `courseDelete`

### Description
Deletes a course record.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Mandatory** | ID of course to delete. |

### Return Payload (`MutationResponse`)
True if course deletion succeeded.

---

## 10. Mutation: `enrollCourse`

### Description
Enrolls the logged-in student in a course using a payment transaction identifier.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseID` | `String` | **Mandatory** | ID of the target course. |
| `transactionID` | `String` | **Mandatory** | The receipt transaction ID. |

### Return Payload (`MutationResponse`)
True if enrollment succeeds.

---

## 11. Mutation: `verifyEnrollment`

### Description
Admin approval or rejection of student course enrollment transaction.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `transactionID` | `String` | **Mandatory** | Target transaction receipt ID. |
| `status` | `String` | **Mandatory** | Verification outcome (`"verified"` or `"rejected"`). |

### Return Payload (`MutationResponse`)
True on successfully updating enrollment verification status.

---

## 12. Query: `getCurriculumUnits`

### Description
Retrieves learning modules/units representing the curriculum sequence of a course.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | **Mandatory** | Target course ID. |

### Return Payload (`CurriculumUnitsResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Success status. |
| `message` | `String` | **Required** | Details message. |
| `data` | `[CurriculumUnit]` | Optional | List of units. |

#### `CurriculumUnit` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Unit ID. |
| `courseId` | `String` | **Required** | Course ID link. |
| `title` | `String` | **Required** | Title of the unit. |
| `description` | `String` | Optional / Nullable | Brief summary of the unit topic. |
| `completed` | `Boolean` | **Required** | Completed checkbox state. |

---

## 13. Query: `getCourseTakeaways`

### Description
Gets learning takeaways (skills gained) listed under a course.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | **Mandatory** | Course ID. |

### Return Payload (`CourseTakeawaysResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Success status. |
| `message` | `String` | **Required** | Detail message. |
| `data` | `[CourseTakeaway]` | Optional | List of takeaways. |

#### `CourseTakeaway` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Takeaway unique ID. |
| `courseId` | `String` | **Required** | Associated course ID. |
| `takeaway` | `String` | **Required** | Detail takeaway sentence. |

---

## 14. Mutation: `addCurriculumUnit`

### Description
Creates a new curriculum module unit under a course.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | **Mandatory** | Course ID. |
| `title` | `String` | **Mandatory** | Module title. |
| `description` | `String` | Optional | Module description details. |

---

## 15. Mutation: `updateCurriculumUnit`

### Description
Updates title/description details of an existing curriculum unit.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Mandatory** | Curriculum unit ID. |
| `title` | `String` | **Mandatory** | New title. |
| `description` | `String` | Optional | New description details. |

---

## 16. Mutation: `toggleCurriculumUnitComplete`

### Description
Toggles the complete/incomplete status of a curriculum unit.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Mandatory** | Curriculum unit ID. |

---

## 17. Mutation: `deleteCurriculumUnit`

### Description
Removes a curriculum unit module from the course.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Mandatory** | Target unit ID to delete. |

---

## 18. Mutation: `addCourseTakeaway`

### Description
Adds a learning takeaway outcome to a course.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `String` | **Mandatory** | Course ID. |
| `takeaway` | `String` | **Mandatory** | Outcome takeaway description string. |

---

## 19. Mutation: `deleteCourseTakeaway`

### Description
Deletes a course takeaway outcome.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Mandatory** | Takeaway entry ID to delete. |

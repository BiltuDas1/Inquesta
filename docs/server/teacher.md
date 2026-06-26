# Teachers Management API Documentation

This document describes the GraphQL queries and mutations associated with administrator actions (onboarding/offboarding teachers) and teacher account activation.

---

## Mutation: `addTeacher`

### Description
An administrator-only mutation that initiates onboarding for a new teacher by reserving their account and generating a unique onboarding invitation URL.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `firstname` | `String` | **Mandatory** | Teacher's first name. |
| `lastname` | `String` | **Mandatory** | Teacher's last name. |
| `email` | `String` | **Mandatory** | Teacher's professional email. |

### Return Payload (`AddTeacherResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Success status. |
| `message` | `String` | **Required** | Details message. |
| `data` | `AddTeacherData` | Optional | Contains generated onboarding link invitation details. |

#### `AddTeacherData` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `link` | `String` | **Required** | Onboarding link URL invitation. |

---

## Mutation: `addedTeacherDetails`

### Description
Allows the newly onboarded teacher to complete their activation by providing their qualifications and establishing an account password.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `teacherId` | `String` | **Mandatory** | Unique teacher user ID. |
| `qualification` | `String` | **Mandatory** | Teacher qualifications summary. |
| `password` | `String` | **Mandatory** | Access login password. |

### Return Payload (`MutationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if activation successfully completed. |
| `message` | `String` | **Required** | Status message. |

---

## Query: `getTeacherInfo`

### Description
Retrieves registration details and qualification info for a specific teacher.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `teacherId` | `String` | **Mandatory** | Unique teacher user ID. |

### Return Payload (`GetTeacherInfoResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if search succeeded. |
| `message` | `String` | **Required** | Details. |
| `data` | `TeacherDetails` | Optional | Full teacher details. |

#### `TeacherDetails` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | **Required** | Teacher's user ID. |
| `firstname` | `String` | **Required** | First name. |
| `lastname` | `String` | Optional / Nullable | Last name. |
| `email` | `String` | **Required** | Account email. |
| `qualification` | `String` | Optional / Nullable | Onboarding qualifications. |
| `is_active` | `Boolean` | **Required** | User active account status. |

---

## Query: `getTeachers`

### Description
Admin query to retrieve list details of all teachers registered in the system.

### Input Parameters
None.

### Return Payload (`GetTeachersResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if retrieval succeeded. |
| `message` | `String` | **Required** | Status details message. |
| `data` | `[TeacherDetails]` | Optional / Nullable | List of all registered teachers. |

---

## Mutation: `updateTeacherByAdmin`

### Description
Enables an administrator to modify profile details or toggle the active status of any teacher account.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `teacherId` | `String` | **Mandatory** | Target teacher's ID. |
| `firstname` | `String` | Optional | Updated first name. |
| `lastname` | `String` | Optional | Updated last name. |
| `email` | `String` | Optional | Updated email. |
| `qualification` | `String` | Optional | Updated qualification text. |
| `isActive` | `Boolean` | Optional | Lock or unlock account status. |

### Return Payload (`MutationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if update succeeded. |
| `message` | `String` | **Required** | Response message description. |

---

## Mutation: `deleteTeacher`

### Description
Admin mutation that permanently deletes a teacher and their related qualifications record from the platform.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `teacherId` | `String` | **Mandatory** | ID of the teacher. |

### Return Payload (`MutationResponse`)
Same structure as `updateTeacherByAdmin`.

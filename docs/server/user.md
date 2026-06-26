# Users and Admin Dashboard API Documentation

This document describes the GraphQL queries and mutations associated with managing general user profile data and fetching admin dashboard metrics.

---

## Mutation: `updateUserInfo`

### Description
Updates the profile information (phone, WhatsApp, qualification) of the currently authenticated user.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `phone_number` | `String` | Optional | User's phone number. |
| `whatsapp_number` | `String` | Optional | User's WhatsApp number. |
| `phone_number_country_code` | `Int` | Optional | Country code for the phone number. |
| `whatsapp_number_country_code` | `Int` | Optional | Country code for the WhatsApp number. |
| `qualification` | `String` | Optional | Educational qualification details. |

### Return Payload (`MutationResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if successfully updated. |
| `message` | `String` | **Required** | Outcome details. |

---

## Query: `getUserInfo`

### Description
Retrieves the profile information (phone, WhatsApp, qualification) of the currently authenticated user.

### Input Parameters
None.

### Return Payload (`GetUserInfoResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Success status. |
| `message` | `String` | **Required** | Outcome description. |
| `data` | `UserInfo` | Optional | Profile details object. |

#### `UserInfo` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `phone` | `String` | Optional / Nullable | User's phone number. |
| `phone_country_code` | `Int` | Optional / Nullable | Phone country code. |
| `whatsapp` | `String` | Optional / Nullable | WhatsApp number. |
| `whatsapp_country_code` | `Int` | Optional / Nullable | WhatsApp country code. |
| `qualification` | `String` | Optional / Nullable | Qualification text description. |

---

## Query: `getAdminDashboardStats`

### Description
Fetches high-level metrics, pending approvals, recent logs, and breakdown statistics for the admin dashboard panel.

### Input Parameters
None.

### Return Payload (`GetAdminDashboardStatsResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if request succeeded. |
| `message` | `String` | **Required** | Explanation details. |
| `data` | `AdminDashboardStats` | Optional | Aggregated metrics stats dataset. |

#### `AdminDashboardStats` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `totalUsers` | `String` | **Required** | Total registered users count. |
| `registeredThisMonth` | `String` | **Required** | Count of registrations this month. |
| `activeCourses` | `String` | **Required** | Total count of published active courses. |
| `pendingApprovals` | `String` | **Required** | Total pending enrollment approvals. |
| `openIssues` | `String` | **Required** | Active support tickets. |
| `userBreakdown` | `[UserBreakdownItem]` | **Required** | User accounts split count by role. |
| `pendingActions` | `[PendingAction]` | **Required** | Critical checklist action items. |
| `activityLog` | `[ActivityLogItem]` | **Required** | Chronological activity event logs. |

#### `UserBreakdownItem` Fields
* `role` (`String`): User role name.
* `count` (`String`): Count value.

#### `PendingAction` Fields
* `id` (`String`): Action ID.
* `title` (`String`): Header title.
* `subtitle` (`String`): Descriptive line.
* `actionText` (`String`): Button label text.
* `type` (`String`): Category code type.

#### `ActivityLogItem` Fields
* `id` (`String`): Log ID.
* `action` (`String`): Summary text.
* `time` (`String`): Event relative timestamp.
* `dotColor` (`String`): Visual alert indicator.

# System Utilities and Layout API Documentation

This document describes the GraphQL queries and mutations associated with files/media upload pre-signing, filter options, health status, and home page hero layout configuration.

---

## Mutation: `request_upload`

### Description
Requests a pre-signed S3/upload URL to securely send file attachments (e.g. for homework or avatar images) directly from the client.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `mimetype` | `String` | **Mandatory** | The file mimetype format (e.g. `"image/png"`, `"application/pdf"`). |

### Return Payload (`UploadResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if pre-signed URL was successfully created. |
| `message` | `String` | **Required** | Message details. |
| `data` | `UploadResponseData` | Optional | Contains pre-signed upload parameters. |

#### `UploadResponseData` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `url` | `String` | **Required** | The pre-signed URL string to PUT or POST the binary file. |
| `filename` | `String` | **Required** | The unique destination path/filename generated on the storage bucket. |

---

## Query: `getFilters`

### Description
Retrieves dynamic ranges and values for course filters (list of levels, grades, price range min/max).

### Input Parameters
None.

### Return Payload (`GetFiltersResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | True if search succeeded. |
| `message` | `String` | **Required** | Explains the query result. |
| `data` | `Filter` | Optional | Filter values data. |

#### `Filter` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `levels` | `[String!]` | **Required** | Array list of course difficulty levels. |
| `grades` | `[String!]` | **Required** | Array list of school grades. |
| `price` | `Price` | **Required** | Active price range metadata. |

#### `Price` Fields
* `minPrice`: `Int` (**Required**)
* `maxPrice`: `Int` (**Required**)

---

## Query: `ping`

### Description
Simple server health diagnostic check.

### Input Parameters
None.

### Return Payload
* Returns `String`: `"pong"`

---

## Query: `getHeroSection`

### Description
Retrieves the landing page hero section text copy, status badge, and background image assets.

### Input Parameters
None.

### Return Payload (`HeroSectionResponse`)
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `success` | `Boolean` | **Required** | Success status. |
| `message` | `String` | **Required** | Description. |
| `data` | `HeroSection` | Optional | Hero panel assets. |

#### `HeroSection` Fields
| Field Name | Type | Required / Optional | Description |
| :--- | :--- | :--- | :--- |
| `statusBadge` | `String` | **Required** | Pill/Badge alert text. |
| `heading` | `String` | **Required** | Primary headline copy. |
| `description` | `String` | **Required** | Subheading copy details. |
| `heroImageUrl` | `String` | **Required** | URL link to hero illustration. |

---

## Mutation: `updateHero`

### Description
Updates landing page hero text copy content and background graphic layout.

### Input Parameters
| Argument Name | Type | Mandatory / Optional | Description |
| :--- | :--- | :--- | :--- |
| `statusBadge` | `String` | **Mandatory** | Banner text tag. |
| `heading` | `String` | **Mandatory** | Headline title. |
| `description` | `String` | **Mandatory** | Headline description paragraphs. |
| `heroImage` | `String` | **Mandatory** | Path/URL to the hero illustration file. |

### Return Payload (`MutationResponse`)
True if update completed successfully.

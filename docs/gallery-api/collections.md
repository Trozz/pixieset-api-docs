---
sidebar_position: 2
title: "Collections"
---

# Collections

Collections are the main organizational unit in the Pixieset Gallery API, containing multiple galleries and serving as the primary way to organize and manage photo/video content. Collections provide centralized management for client access, download permissions, and sharing settings.

## Overview

Collections serve as containers for galleries and provide:
- Centralized client access management
- Bulk download and sharing controls
- Unified settings for watermarks and permissions
- Analytics and tracking across all contained galleries
- E-commerce functionality for selling photos

## Get Collection Details

Retrieve detailed information about a specific collection.

```http
GET /collections/{collection_id}
```

### Query Parameters

- `expand` (optional): Include additional data
  - `video_cover`: Include video cover information

### Response

Returns collection object with:
- `id`: Unique collection identifier
- `name`: Collection name
- `description`: Collection description
- `gallery_count`: Number of galleries
- `client_count`: Number of clients with access
- `expiry_date`: Collection expiration date
- `password_protected`: Boolean
- `downloadable`: Download permission status

## Edit Collection

Get editable collection data for modification.

```http
GET /collections/{collection_id}/edit
```

### Response

Returns editable collection data including:
- Collection settings
- Distinct tags
- Expiry reminders
- Message languages
- Watermark settings

## Update Collection

Update collection properties and settings.

```http
PUT /collections/{collection_id}
```

Updates collection configuration including name, description, privacy settings, and client access permissions.

## Get Collection Galleries

Retrieve all galleries within a collection.

```http
GET /collections/{collection_id}/galleries
```

### Response

Returns array of gallery objects with:
- `id`: Gallery ID
- `collection_id`: Parent collection ID
- `name`: Gallery name
- `description`: Gallery description
- `photo_count`: Number of photos
- `video_count`: Number of videos
- `private`: Privacy status
- `download`: Download permissions
- `cover_photo`: Cover image information

## Collection Before Hooks

Pre-action validation and settings endpoints that run before certain operations.

### Before Show

```http
GET /collections/{collection_id}/before_show
```

Validates collection access permissions before displaying collection content.

### Before Download Settings

```http
GET /collections/{collection_id}/before_download_settings
```

Validates download permissions and settings before allowing downloads.

## Get Collection Clients

Retrieve clients with access to the collection.

```http
GET /collections/{collection_id}/clients
```

### Response

Returns array of client objects with:
- `id`: Client identifier
- `email`: Client email
- `name`: Client name
- `access_level`: Permission level
- `last_accessed`: Last access timestamp
- `favorites_count`: Number of favorited items

## Get Visitor Emails

Get email addresses of collection visitors.

```http
GET /collections/{collection_id}/visitor_emails
```

### Response

Returns list of email addresses that have accessed the collection, useful for tracking engagement and follow-up communications.

## Common Usage Patterns

### Expanding Collection Data

Use the `expand` parameter to include related data in a single request:

```http
GET /collections/123?expand=video_cover
```

### Collection Management Workflow

1. **Get Collection Details** - Retrieve current collection state
2. **Edit Collection** - Get editable data structure
3. **Update Collection** - Apply changes
4. **Validate with Before Hooks** - Ensure changes are valid

### Client Access Management

Collections provide centralized client access control:

1. Use `GET /collections/{id}/clients` to see current access
2. Track visitor engagement with `GET /collections/{id}/visitor_emails`
3. Monitor activity through download and sharing endpoints

## Related Endpoints

Collections integrate with several other API areas:

- **Downloads**: Track photo and video downloads at collection level
- **Favorites**: Manage client favorites across all galleries in collection
- **Store**: E-commerce features for selling photos from collection
- **Analytics**: Comprehensive tracking of collection activity

## Best Practices

- Use collections to group related galleries by event, client, or project
- Leverage the `expand` parameter to reduce API calls when you need related data
- Always validate permissions using before hooks when appropriate
- Monitor client engagement through visitor emails and access tracking
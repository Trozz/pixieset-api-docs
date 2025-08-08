---
sidebar_position: 1
title: Overview
---

# Gallery API Overview

The Pixieset Gallery API manages photo galleries, collections, and client access for photo delivery and sales.

Base URL: `https://galleries.pixieset.com/api/v1`

## Key Features

The Gallery API provides functionality for:

- **Gallery Management** - Create and manage photo/video galleries
- **Collections** - Organize galleries into collections
- **Client Access** - Control client permissions and sharing
- **Downloads** - Track and manage photo/video downloads
- **Favorites** - Client favoriting functionality
- **Store Integration** - E-commerce features for selling photos
- **Watermarking** - Apply watermarks to photos
- **Analytics** - Track visitor activity and downloads

## API Sections

### Content Management
- [Collections](/docs/gallery-api/collections) - Organize galleries
- Galleries - Individual gallery management
- Photos & Videos - Media management

### Client Features
- Client Access - Permissions and sharing
- [Downloads](/docs/gallery-api/downloads) - Download tracking
- Favorites - Client favorites

### Customization
- Templates - Cover and display templates
- Watermarks - Watermark configuration
- Store Settings - E-commerce configuration

## Quick Start Example

### Get Collection Details
```bash
curl -X GET "https://galleries.pixieset.com/api/v1/collections/90516387" \
  -H "Cookie: session_cookie=your_session"
```

### Response
```json
{
  "data": {
    "id": 90516387,
    "name": "Wedding Photography 2025",
    "description": "Beautiful wedding moments",
    "gallery_count": 5,
    "photo_count": 450,
    "video_count": 12,
    "password_protected": true,
    "downloadable": true,
    "expiry_date": "2025-12-31"
  }
}
```

## Core Concepts

### Collections vs Galleries

- **Collections** - Top-level containers that group related galleries
- **Galleries** - Individual sets of photos/videos within a collection

```
Collection: "Smith Wedding 2025"
├── Gallery: "Getting Ready"
├── Gallery: "Ceremony"
├── Gallery: "Reception"
└── Gallery: "Portraits"
```

### Access Control

Multiple levels of access control:
1. **Collection Level** - Password protection, expiry dates
2. **Gallery Level** - Private/public settings
3. **Client Level** - Individual client permissions
4. **Download Level** - Control what can be downloaded

## Common Patterns

### Before Hooks

Several endpoints use a "before_" pattern for validation:

```http
GET /collections/{id}/before_show
GET /collections/{id}/before_download_settings
GET /collection_defaults/{id}/before_collection_default_settings
```

These validate permissions and settings before actions.

### Bootstrap Data

Initial configuration loaded at startup:

```http
GET /data/bootstrap
```

Returns:
- Account information
- User profile
- Custom URL settings
- Workspace configuration

## Response Format

Standard response structure:
```json
{
  "data": {
    // Response data
  },
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 100,
    "total_pages": 4
  }
}
```

## Media Management

### Supported Media Types
- **Photos** - JPEG, PNG, RAW formats
- **Videos** - MP4, MOV formats
- **Galleries** - Mixed photo/video content

### Download Options
- Individual downloads
- Bulk downloads
- Original vs web-optimized versions
- Watermarked vs clean versions

## Analytics & Tracking

Track client engagement:
- Download counts by photo/video
- Visitor email collection
- Favorite selections
- Store activity and sales

## Next Steps

Explore specific API sections:
1. [Collections Management](/docs/gallery-api/collections)
2. Gallery Operations
3. Client Access Control
4. [Download Tracking](/docs/gallery-api/downloads)
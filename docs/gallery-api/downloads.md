---
sidebar_position: 3
title: "Downloads & Sharing"
---

# Downloads & Sharing

The Downloads & Sharing section of the Gallery API provides comprehensive tracking and management of client downloads, sharing links, and favorite selections. These endpoints allow photographers to monitor client engagement and track which content is being accessed and downloaded.

## Overview

The downloads system tracks multiple types of client activity:
- **Photo Downloads** - Individual photo download tracking
- **Video Downloads** - Video-specific download monitoring
- **Comprehensive Downloads** - All download activity combined
- **Sharing Links** - Shareable photo links management
- **Favorites** - Client favoriting and starring functionality

Key differences:
- **Photo Downloads**: Track image files downloaded by clients
- **Video Downloads**: Specifically monitor video file downloads (separate tracking)
- **All Downloads**: Combined view of all download activity for comprehensive analytics

## Photo Downloads

Track photo download activity within a collection.

```http
GET /collections/{collection_id}/photo_downloads
```

### Response

Returns detailed tracking of photo downloads including:
- Download timestamps
- Client information
- Photo identifiers
- Download counts per photo
- File format and size information

This endpoint provides granular visibility into which photos are most popular and helps photographers understand client preferences.

## Video Downloads

Track video download activity within a collection.

```http
GET /collections/{collection_id}/gallery_video_downloads
```

### Response

Returns video-specific download tracking including:
- Video file download history
- Client download activity
- Video identifiers and metadata
- Download completion status

**Note**: Video downloads are tracked separately from photo downloads due to different file handling requirements and typically larger file sizes that may require different monitoring approaches.

## All Downloads

Comprehensive download tracking combining all download types.

```http
GET /collections/{collection_id}/downloads/
```

### Response

Provides unified view of all download activity including:
- Combined photo and video downloads
- Complete client activity timeline
- Download success/failure status
- Bandwidth and transfer metrics

This endpoint is ideal for getting a complete picture of collection engagement and download patterns.

## Photo Sharing Links

Manage shareable links for individual photos within a collection.

```http
GET /collections/{collection_id}/photo_sharing_links
```

### Response

Returns sharing link information including:
- Generated sharing URLs
- Link expiration dates
- Access permissions
- Usage statistics for shared links

Sharing links provide a way for clients to share specific photos without giving access to the entire collection, maintaining privacy while enabling targeted sharing.

## Collection Favorites

Retrieve photos and videos favorited by clients within a collection.

```http
GET /collections/{collection_id}/favorites
```

### Response

Returns client favorite selections including:
- Favorited photo and video IDs
- Client information who favorited items
- Favorite timestamps
- Favorite counts per media item

This data helps photographers understand which content resonates most with clients and can inform future shooting and curation decisions.

## Starred Photos

Get all starred/favorited photos across all collections for the authenticated user.

```http
GET /photos/starred
```

### Response

Returns global starred photo data including:
- All starred photos across collections
- Cross-collection favorite analytics
- Popular content identification
- Client engagement patterns

This global view helps photographers identify their most successful work across all projects.

## Comprehensive Download Tracking

The Gallery API provides multi-layered download tracking:

### Individual Media Tracking
- Every photo and video download is logged
- Client attribution for each download
- Timestamp and metadata capture

### Collection-Level Analytics
- Aggregate download statistics
- Client engagement metrics
- Popular content identification

### Cross-Collection Insights
- Global starred content tracking
- Portfolio-wide engagement analysis
- Client preference patterns

## Usage Patterns

### Download Activity Monitoring

```http
# Get all download activity for a collection
GET /collections/123/downloads/

# Focus on photo downloads specifically
GET /collections/123/photo_downloads

# Monitor video downloads separately
GET /collections/123/gallery_video_downloads
```

### Client Engagement Analysis

```http
# See what clients are favoriting
GET /collections/123/favorites

# Track sharing activity
GET /collections/123/photo_sharing_links

# Get global starred content
GET /photos/starred
```

### Analytics Workflow

1. **Overall Activity** - Use `/downloads/` for complete picture
2. **Media-Specific** - Use photo/video specific endpoints for detailed analysis
3. **Client Preferences** - Monitor favorites and shares for engagement insights
4. **Global Trends** - Use starred photos for portfolio-wide analytics

## Best Practices

- **Monitor Both Types**: Track photo and video downloads separately to understand different usage patterns
- **Client Insights**: Use favorites data to understand what content resonates with clients
- **Sharing Strategy**: Leverage sharing links for targeted content distribution
- **Performance Analysis**: Use comprehensive download tracking to identify successful work
- **Client Follow-up**: Use download activity to inform client communications and marketing

## Integration Points

Downloads & Sharing data integrates with:
- **Client Management** - Understanding client preferences
- **Store Features** - Identifying popular items for sales
- **Analytics** - Comprehensive engagement tracking
- **Marketing** - Content performance analysis

The downloads system provides essential business intelligence for photographers to understand client engagement, optimize their offerings, and grow their business through data-driven insights.
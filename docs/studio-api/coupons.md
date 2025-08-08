---
sidebar_position: 7
title: Coupons & Discounts
---

# Coupons & Discounts API

Manage coupon codes, discount campaigns, and promotional offers for your photography business.

## Overview

The Coupons & Discounts API provides comprehensive functionality for:
- Creating and managing discount coupons
- Tracking coupon usage and activity
- Setting expiration dates and usage limits
- Managing coupon status (active/disabled)
- Monitoring coupon performance and analytics

## ID Formats

- **Coupon ID**: `cou_` prefix + 30 alphanumeric characters (e.g., `cou_COU001ABC123DEF456GHI789JKL01`)

## Endpoints

### List Coupons

```http
GET /coupons
```

Retrieve a paginated list of all coupons with optional filtering.

**Query Parameters:**
- `page` - Page number for pagination (default: 1)
- `filter` - Filter by coupon status:
  - `active` - Show only active coupons
  - `disabled` - Show only disabled coupons
  - `expired` - Show only expired coupons
  - `all` - Show all coupons (default)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/coupons?filter=active&page=1" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response Structure:**
```json
{
  "data": [
    {
      "id": "cou_COU001ABC123DEF456GHI789JKL01",
      "code": "SUMMER20",
      "discount_type": "percentage",
      "discount_value": 20,
      "status": "active",
      "usage_count": 15,
      "usage_limit": 100,
      "expires_at": "2025-08-31T23:59:59.000000Z",
      "created_at": "2025-01-15T10:00:00.000000Z",
      "updated_at": "2025-07-01T14:30:00.000000Z"
    }
  ],
  "links": {
    "first": "https://studio.pixieset.com/api/v1/coupons?page=1",
    "last": "https://studio.pixieset.com/api/v1/coupons?page=3",
    "prev": null,
    "next": "https://studio.pixieset.com/api/v1/coupons?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 3,
    "per_page": 25,
    "to": 25,
    "total": 67
  }
}
```

### Create Coupon

```http
POST /coupons
```

Create a new discount coupon.

**Request Body:**
```json
{
  "code": "NEWCLIENT15",
  "discount_type": "percentage",
  "discount_value": 15,
  "usage_limit": 50,
  "expires_at": "2025-12-31T23:59:59.000000Z",
  "minimum_order_amount": 10000,
  "description": "15% off for new clients"
}
```

**Parameters:**
- `code` (required) - Unique coupon code
- `discount_type` (required) - Type of discount (`percentage` or `fixed_amount`)
- `discount_value` (required) - Discount value (percentage or amount in smallest currency unit)
- `usage_limit` (optional) - Maximum number of times coupon can be used
- `expires_at` (optional) - Expiration date in ISO 8601 format
- `minimum_order_amount` (optional) - Minimum order value to apply coupon
- `description` (optional) - Internal description for the coupon

**Example Request:**
```bash
curl -X POST "https://studio.pixieset.com/api/v1/coupons" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "NEWCLIENT15",
    "discount_type": "percentage",
    "discount_value": 15,
    "usage_limit": 50
  }'
```

### Get Coupon Details

```http
GET /coupons/{coupon_id}/
```

Retrieve detailed information about a specific coupon.

**Path Parameters:**
- `coupon_id` - The unique coupon identifier (e.g., `cou_COU001ABC123DEF456GHI789JKL01`)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/coupons/cou_COU001ABC123DEF456GHI789JKL01/" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response Structure:**
```json
{
  "data": {
    "id": "cou_COU001ABC123DEF456GHI789JKL01",
    "code": "SUMMER20",
    "discount_type": "percentage",
    "discount_value": 20,
    "status": "active",
    "usage_count": 15,
    "usage_limit": 100,
    "minimum_order_amount": 5000,
    "expires_at": "2025-08-31T23:59:59.000000Z",
    "description": "Summer promotion - 20% off all sessions",
    "created_at": "2025-01-15T10:00:00.000000Z",
    "updated_at": "2025-07-01T14:30:00.000000Z"
  }
}
```

### Update Coupon

```http
PUT /coupons/{coupon_id}
```

Update an existing coupon's details.

**Path Parameters:**
- `coupon_id` - The unique coupon identifier

**Request Body:**
```json
{
  "discount_value": 25,
  "usage_limit": 150,
  "expires_at": "2025-09-30T23:59:59.000000Z",
  "description": "Updated summer promotion - 25% off"
}
```

**Example Request:**
```bash
curl -X PUT "https://studio.pixieset.com/api/v1/coupons/cou_COU001ABC123DEF456GHI789JKL01" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "discount_value": 25,
    "usage_limit": 150
  }'
```

### Delete Coupon

```http
DELETE /coupons/{coupon_id}
```

Permanently delete a coupon. **Warning:** This action cannot be undone.

**Path Parameters:**
- `coupon_id` - The unique coupon identifier

**Example Request:**
```bash
curl -X DELETE "https://studio.pixieset.com/api/v1/coupons/cou_COU001ABC123DEF456GHI789JKL01" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response:**
```json
{
  "message": "Coupon deleted successfully"
}
```

### Disable Coupon

```http
PUT /coupons/{coupon_id}/disable
```

Disable an active coupon without deleting it. Disabled coupons cannot be used but maintain their usage history.

**Path Parameters:**
- `coupon_id` - The unique coupon identifier

**Example Request:**
```bash
curl -X PUT "https://studio.pixieset.com/api/v1/coupons/cou_COU001ABC123DEF456GHI789JKL01/disable" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response:**
```json
{
  "data": {
    "id": "cou_COU001ABC123DEF456GHI789JKL01",
    "code": "SUMMER20",
    "status": "disabled",
    "disabled_at": "2025-08-07T15:30:00.000000Z"
  }
}
```

### Get Coupon Activity

```http
GET /coupons/{coupon_id}/activity
```

Retrieve usage history and activity log for a specific coupon.

**Path Parameters:**
- `coupon_id` - The unique coupon identifier

**Query Parameters:**
- `page` - Page number for pagination (default: 1)
- `per_page` - Results per page (default: 25, max: 100)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/coupons/cou_COU001ABC123DEF456GHI789JKL01/activity" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response Structure:**
```json
{
  "data": [
    {
      "id": "ca_abc123def456ghi789",
      "coupon_id": "cou_COU001ABC123DEF456GHI789JKL01",
      "invoice_id": "in_INV001ABC123DEF456GHI789JKL012",
      "client_id": "cl_XYZ789DEF456GHI123JKL456MNO789",
      "discount_applied": 2000,
      "discount_applied_formatted": "$20.00",
      "used_at": "2025-08-05T14:22:33.000000Z",
      "client": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com"
      },
      "invoice": {
        "amount": 10000,
        "amount_formatted": "$100.00"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "total_usage": 15,
    "total_discount_given": 45000,
    "total_discount_given_formatted": "$450.00"
  }
}
```

## Gift Cards

### List Gift Cards

```http
GET /gift_cards
```

Retrieve a list of all gift cards in the system.

**Query Parameters:**
- `page` - Page number for pagination (default: 1)
- `per_page` - Results per page (default: 25, max: 100)
- `status` - Filter by status (`active`, `redeemed`, `expired`, `all`)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/gift_cards?status=active" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response Structure:**
```json
{
  "data": [
    {
      "id": "gc_xyz789abc123def456ghi789",
      "code": "GC-2025-001",
      "amount": 15000,
      "amount_formatted": "$150.00",
      "balance": 15000,
      "balance_formatted": "$150.00",
      "status": "active",
      "expires_at": "2026-08-07T23:59:59.000000Z",
      "purchased_by": {
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com"
      },
      "created_at": "2025-08-01T10:00:00.000000Z"
    }
  ],
  "links": {
    "first": "https://studio.pixieset.com/api/v1/gift_cards?page=1",
    "last": "https://studio.pixieset.com/api/v1/gift_cards?page=2",
    "prev": null,
    "next": "https://studio.pixieset.com/api/v1/gift_cards?page=2"
  },
  "meta": {
    "current_page": 1,
    "total": 45,
    "per_page": 25
  }
}
```

## Common Response Fields

### Coupon Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique coupon identifier with `cou_` prefix |
| `code` | string | Human-readable coupon code |
| `discount_type` | string | Type of discount (`percentage` or `fixed_amount`) |
| `discount_value` | number | Discount value (percentage or amount in smallest currency unit) |
| `status` | string | Current status (`active`, `disabled`, `expired`) |
| `usage_count` | number | Number of times coupon has been used |
| `usage_limit` | number | Maximum allowed usage (null for unlimited) |
| `minimum_order_amount` | number | Minimum order value required (in smallest currency unit) |
| `expires_at` | string | Expiration date in ISO 8601 format |
| `description` | string | Internal description of the coupon |
| `created_at` | string | Creation timestamp in ISO 8601 format |
| `updated_at` | string | Last modification timestamp in ISO 8601 format |

### Discount Types

- **percentage** - Discount as a percentage of the order total (e.g., 20 for 20%)
- **fixed_amount** - Fixed discount amount in the smallest currency unit (e.g., 1500 for $15.00)

### Coupon Status Values

- **active** - Coupon is available for use
- **disabled** - Coupon has been manually disabled
- **expired** - Coupon has passed its expiration date
- **exhausted** - Coupon has reached its usage limit

## Error Handling

The API returns standard HTTP status codes:

- `200 OK` - Request successful
- `201 Created` - Coupon created successfully
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Coupon not found
- `409 Conflict` - Coupon code already exists
- `422 Unprocessable Entity` - Validation errors

**Error Response Example:**
```json
{
  "error": "Validation failed",
  "message": "The coupon code has already been taken.",
  "details": {
    "code": ["The code has already been taken."]
  }
}
```

## Best Practices

1. **Unique Codes**: Ensure coupon codes are unique and easily identifiable
2. **Expiration Dates**: Always set reasonable expiration dates for promotional campaigns
3. **Usage Limits**: Consider setting usage limits to control campaign costs
4. **Minimum Orders**: Use minimum order amounts to maintain profit margins
5. **Activity Monitoring**: Regularly check coupon activity to track campaign performance
6. **Status Management**: Disable rather than delete coupons to maintain historical data
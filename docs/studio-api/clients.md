---
sidebar_position: 2
title: Clients & CRM
---

# Clients & CRM API

Manage clients, leads, and contacts in your photography business.

## Client Types

The API distinguishes between:
- **`client`** - Active paying customers
- **`lead`** - Potential customers who have inquired
- **`other`** - Other contacts

## Endpoints

### List Clients

```http
GET /clients/
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Results per page (default: 25)
- `types` - Filter by type: `client`, `lead`, `client,lead`

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/clients/?types=client,lead&page=1" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": [
    {
      "id": "cl_ABC123DEF456GHI789JKL012MNO345",
      "email": "client@example.com",
      "status_name": "Active",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "1234567890",
      "company": null,
      "job_title": null,
      "address_info": {
        "address_line_1": "123 Main St",
        "address_line_2": null,
        "city": "New York",
        "postal_code": "10001",
        "state": "NY",
        "country": "United States",
        "country_id": 223
      },
      "notes": null,
      "avatar_color": 8,
      "created_at": "2025-08-06T14:50:42.000000Z",
      "sample": false,
      "type": "client",
      "type_formatted": "Client"
    }
  ],
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 21,
    "per_page": 25,
    "to": 25,
    "total": 513,
    "client_statuses": {
      "1": "Active",
      "2": "Archived"
    },
    "csv_url": "https://studio.pixieset.com/api/v1/clients/download_csv"
  }
}
```

### Get Client Details

```http
GET /clients/{client_id}
```

**Path Parameters:**
- `client_id` - Client identifier (e.g., `cl_ABC123DEF456GHI789JKL012MNO345`)

### Update Client

```http
PUT /clients/{client_id}
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "company": "Photography Inc",
  "address_info": {
    "address_line_1": "123 Main St",
    "city": "New York",
    "postal_code": "10001",
    "state": "NY",
    "country_id": 223
  },
  "notes": "VIP client",
  "type": "client"
}
```

### Search Clients

```http
GET /clients/search
```

**Query Parameters:**
- `q` - Search query string
- `types` - Filter: `all`, `client`, `lead`
- `page` - Page number
- `pageSize` - Results per page (max: 100)

**Example:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/clients/search?q=john&types=all&page=1" \
  -H "Cookie: session_cookie=your_session"
```

## Client Collections

### Get Client Collections

```http
GET /clients/{client_id}/cgCollections/
```

**Query Parameters:**
- `page_size` - Results per page
- `page` - Page number

Returns galleries/collections associated with the client.

## Client Documents

### Get Client Documents

```http
GET /clients/{client_id}/documents
```

**Query Parameters:**
- `expand` - Additional data to include (e.g., `gift_card_activities`)
- `page` - Page number

Returns all documents (contracts, invoices, etc.) for the client.

## Client Object

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique client identifier |
| `email` | string | Client email address |
| `status_name` | string | Status (Active/Archived) |
| `first_name` | string | First name |
| `last_name` | string | Last name |
| `phone` | string | Phone number |
| `company` | string | Company name |
| `job_title` | string | Job title |
| `address_info` | object | Address details |
| `notes` | string | Internal notes |
| `avatar_color` | integer | Avatar color index |
| `created_at` | datetime | Creation timestamp |
| `type` | string | client/lead/other |
| `type_formatted` | string | Formatted type label |

### Address Info Object

```json
{
  "address_line_1": "123 Main St",
  "address_line_2": "Apt 4B",
  "city": "New York",
  "postal_code": "10001",
  "state": "NY",
  "country": "United States",
  "country_id": 223
}
```

## Bulk Operations

### Export Clients to CSV

The CSV export URL is provided in the list response metadata:
```json
{
  "meta": {
    "csv_url": "https://studio.pixieset.com/api/v1/clients/download_csv"
  }
}
```

## Best Practices

1. **Use type filters** - Filter by `client` or `lead` to reduce response size
2. **Implement search** - Use the search endpoint for user-driven lookups
3. **Cache client data** - Client details don't change frequently
4. **Handle pagination** - Process large client lists in batches
5. **Track client types** - Maintain distinction between clients and leads

## Related Endpoints

- [Conversations](/docs/studio-api/conversations) - Client messaging
- [Invoices](/docs/studio-api/invoices) - Client billing
- [Sessions](/docs/studio-api/sessions) - Client bookings
- [Documents](/docs/studio-api/contracts) - Client documents
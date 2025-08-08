---
sidebar_position: 1
title: Overview
---

# Studio API Overview

The Pixieset Studio API is a comprehensive photography business management platform.

Base URL: `https://studio.pixieset.com/api/v1`

## Key Features

The Studio API provides endpoints for:

- **Client Management** - CRM functionality for clients and leads
- **Document Management** - Contracts, questionnaires, quotes, and invoices
- **Session Booking** - Scheduling, availability, and session types
- **Payment Processing** - Invoicing, payments, coupons, and gift cards
- **Communication** - Conversations and messaging with clients
- **Templates** - Reusable templates for various document types
- **Reporting** - Payment analytics and business metrics
- **Integrations** - Google Calendar and PayPal

## API Sections

### Core Business Management
- [Clients & CRM](/docs/studio-api/clients) - Manage clients, leads, and contacts
- [Sessions & Booking](/docs/studio-api/sessions) - Session types and scheduling
- [Invoices & Payments](/docs/studio-api/invoices) - Financial management

### Document Management
- [Contracts](/docs/studio-api/contracts) - Legal agreements
- [Questionnaires](/docs/studio-api/questionnaires) - Client information gathering
- Quotes - Price quotes and proposals

### Communication & Marketing
- [Conversations](/docs/studio-api/conversations) - Client messaging
- [Templates](/docs/studio-api/templates) - Reusable document templates
- [Coupons](/docs/studio-api/coupons) - Discount codes and promotions

### Analytics & Configuration
- Payment Reporting - Business analytics
- Integrations - Third-party services
- Settings - System configuration

## Quick Start Example

### Get All Clients
```bash
curl -X GET "https://studio.pixieset.com/api/v1/clients/" \
  -H "Cookie: session_cookie=your_session"
```

### Response
```json
{
  "data": [
    {
      "id": "cl_ABC123DEF456GHI789JKL012MNO345",
      "email": "client@example.com",
      "status_name": "Active",
      "first_name": "John",
      "last_name": "Doe",
      "type": "client",
      "created_at": "2025-08-06T14:50:42.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 513
  }
}
```

## Common ID Formats

The Studio API uses consistent ID prefixes:

| Resource | Prefix | Example |
|----------|--------|---------|
| Client | `cl_` | `cl_ABC123DEF456GHI789JKL012MNO345` |
| Invoice | `in_` | `in_INV001ABC123DEF456GHI789JKL012` |
| Session Type | `set_` | `set_SES001ABC123DEF456GHI789JKL012` |
| Contract | `co_` | `co_CON001ABC123DEF456GHI789JKL012` |
| Questionnaire | `qu_` | `qu_QUE001ABC123DEF456GHI789JKL012` |
| Quote | `qo_` | `qo_QUO001ABC123DEF456GHI789JKL012` |

## Response Format

All endpoints return a consistent structure:

```json
{
  "data": {
    // Main response data
  },
  "meta": {
    // Pagination and metadata
  },
  "links": {
    // Navigation links
  }
}
```

## Error Handling

Standard HTTP status codes:
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

## Rate Limiting

The API implements rate limiting to ensure fair usage:
- Monitor response headers for rate limit information
- Implement exponential backoff for retries
- Cache responses when appropriate

## Next Steps

Explore specific API sections:
1. [Client Management](/docs/studio-api/clients)
2. [Session Booking](/docs/studio-api/sessions)
3. [Invoicing & Payments](/docs/studio-api/invoices)
4. [Document Management](/docs/studio-api/contracts)
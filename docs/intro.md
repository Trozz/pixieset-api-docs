---
sidebar_position: 1
title: Getting Started
---

# Pixieset API Documentation

Welcome to the unofficial API documentation for Pixieset's photography business management platform.

:::warning Disclaimer
This is **unofficial documentation** created through reverse engineering and API analysis. It is not affiliated with or endorsed by Pixieset. APIs may change without notice. Use at your own risk.
:::

## Overview

Pixieset provides two main APIs that work together to create a complete photography business solution:

### 🏢 Studio API
The **Studio API** handles the business management side of your photography business:
- Client relationship management (CRM)
- Session booking and scheduling
- Invoice and payment processing
- Document management (contracts, questionnaires)
- Business analytics and reporting

[Explore Studio API →](/docs/studio-api/overview)

### 🖼️ Gallery API
The **Gallery API** manages the client-facing delivery and sales platform:
- Photo and video gallery management
- Client access control and sharing
- Download tracking and favorites
- E-commerce integration for print sales
- Watermarking and presentation

[Explore Gallery API →](/docs/gallery-api/overview)

## Quick Start

### Base URLs

```
Studio API: https://studio.pixieset.com/api/v1
Gallery API: https://galleries.pixieset.com/api/v1
```

### Authentication

Both APIs use session-based authentication with cookies. You'll need to:
1. Authenticate with your Pixieset credentials
2. Include session cookies in all API requests
3. Handle session expiration and renewal

### Making Your First Request

Here's a simple example to get started with the Studio API:

```bash
# Get list of clients
curl -X GET "https://studio.pixieset.com/api/v1/clients/" \
  -H "Cookie: your-session-cookie"
```

## Key Features

### For Studio Management
- **Comprehensive CRM** - Manage clients, leads, and contacts
- **Flexible Scheduling** - Session types with availability management
- **Financial Tools** - Invoicing, payments, and financial reporting
- **Document Automation** - Templates for contracts and questionnaires
- **Integration Ready** - Google Calendar and PayPal support

### For Gallery Delivery
- **Collection Organization** - Group galleries into collections
- **Client Portals** - Controlled access with passwords and expiry
- **Sales Integration** - Built-in e-commerce for print sales
- **Analytics** - Track downloads, views, and client engagement
- **Customization** - Watermarks, themes, and branding options

## Common Patterns

### Response Format
All API responses follow a consistent structure:

```json
{
  "data": {
    // Response data
  },
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 100
  }
}
```

### Error Handling
Standard HTTP status codes are used:
- `200 OK` - Successful request
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Pagination
Most list endpoints support pagination:
```
GET /endpoint?page=1&per_page=25
```

## Need Help?

- Check the detailed documentation for each API
- Review the authentication guide
- Explore endpoint references with examples
- Understand error handling and best practices

## Next Steps

1. **[Set up Authentication](/docs/authentication)** - Get your API access configured
2. **[Explore Studio API](/docs/studio-api/overview)** - Business management endpoints
3. **[Explore Gallery API](/docs/gallery-api/overview)** - Client delivery endpoints
4. **[Review Best Practices](/docs/best-practices)** - Tips for efficient API usage
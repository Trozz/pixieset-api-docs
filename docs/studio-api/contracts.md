---
sidebar_position: 5
title: Contracts
---

# Contracts API

Manage contracts and contract templates for your photography business workflow.

## Overview

The Contracts API provides comprehensive functionality for:
- Managing client contracts and contract documents
- Creating and customizing contract templates with HTML body and variable placeholders
- Configuring due days, reminders, and signer settings
- Tracking contract status and client signatures
- Integrating contracts with session types and booking workflows

## ID Formats

- **Contract ID**: `co_` prefix + 30 alphanumeric characters (e.g., `co_CON001ABC123DEF456GHI789JKL012`)
- **Contract Template ID**: `ct_` prefix + 30 alphanumeric characters (e.g., `ct_CON002ABC123DEF456GHI789JKL012`)

## Endpoints

### List Contracts

```http
GET /contracts/
```

Retrieve a paginated list of contracts with optional filtering and data expansion.

**Query Parameters:**
- `expand` - Include additional data (`all` for all related data, `client` for client information)
- `page` - Page number for pagination
- `per_page` - Results per page

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/contracts/?expand=all&page=1" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": [
    {
      "id": "co_CON001ABC123DEF456GHI789JKL012",
      "contract_number": "CON-001",
      "status": "sent",
      "created_at": "2025-08-07T10:30:00.000000Z",
      "due_date": "2025-08-21T23:59:59.000000Z",
      "signed_date": null,
      "client": {
        "id": "cl_ABC123DEF456GHI789JKL012MNO345",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com"
      },
      "template": {
        "id": "ct_CON002ABC123DEF456GHI789JKL012",
        "name": "Wedding Photography Contract",
        "due_days": 14
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 45,
    "last_page": 2
  }
}
```

### Get Contract Details

```http
GET /contracts/{contract_id}
```

Retrieve detailed information about a specific contract, including content and signatures.

**Path Parameters:**
- `contract_id` - Contract identifier (e.g., `co_CON001ABC123DEF456GHI789JKL012`)

**Query Parameters:**
- `expand` - Include additional data (`all` for complete contract details including rendered content)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/contracts/co_CON001ABC123DEF456GHI789JKL012?expand=all" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "id": "co_CON001ABC123DEF456GHI789JKL012",
    "contract_number": "CON-001",
    "status": "signed",
    "created_at": "2025-08-07T10:30:00.000000Z",
    "sent_at": "2025-08-07T10:35:00.000000Z",
    "due_date": "2025-08-21T23:59:59.000000Z",
    "signed_date": "2025-08-10T14:22:00.000000Z",
    "client": {
      "id": "cl_ABC123DEF456GHI789JKL012MNO345",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "+1-555-123-4567"
    },
    "template": {
      "id": "ct_CON002ABC123DEF456GHI789JKL012",
      "name": "Wedding Photography Contract",
      "due_days": 14
    },
    "content": {
      "rendered_html": "<html><body><h1>Photography Services Contract</h1>...",
      "variables": {
        "client_name": "John Doe",
        "event_date": "2025-09-15",
        "event_location": "Central Park, NYC"
      }
    },
    "signatures": [
      {
        "signer_type": "client",
        "signer_name": "John Doe",
        "signer_email": "john@example.com",
        "signed_at": "2025-08-10T14:22:00.000000Z",
        "signature_image_url": "https://..."
      },
      {
        "signer_type": "photographer",
        "signer_name": "Jane Smith",
        "signer_email": "jane@studio.com",
        "signed_at": "2025-08-10T15:30:00.000000Z",
        "signature_image_url": "https://..."
      }
    ]
  }
}
```

## Contract Templates

Contract templates are reusable document templates that define the structure, content, and configuration for contracts sent to clients.

### List Contract Templates

```http
GET /templates/contracts
```

Retrieve a list of all contract templates available in your studio.

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/templates/contracts" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": [
    {
      "id": "ct_CON002ABC123DEF456GHI789JKL012",
      "name": "Wedding Photography Contract",
      "description": "Standard wedding photography service agreement",
      "due_days": 14,
      "status": "active",
      "created_at": "2025-07-15T09:00:00.000000Z",
      "updated_at": "2025-08-01T14:30:00.000000Z",
      "signers": [
        {
          "type": "client",
          "required": true,
          "order": 1
        },
        {
          "type": "photographer",
          "required": true,
          "order": 2
        }
      ],
      "reminders": {
        "enabled": true,
        "days_before_due": [7, 3, 1]
      }
    },
    {
      "id": "ct_CON003ABC123DEF456GHI789JKL012",
      "name": "Portrait Session Contract",
      "description": "Individual and family portrait session agreement",
      "due_days": 7,
      "status": "active",
      "created_at": "2025-07-20T11:15:00.000000Z",
      "updated_at": "2025-07-25T16:45:00.000000Z",
      "signers": [
        {
          "type": "client",
          "required": true,
          "order": 1
        }
      ],
      "reminders": {
        "enabled": true,
        "days_before_due": [3, 1]
      }
    }
  ],
  "meta": {
    "total": 2
  }
}
```

### Get Contract Template Details

```http
GET /templates/contracts/{template_id}
```

Retrieve detailed information about a specific contract template, including the HTML content and variable placeholders.

**Path Parameters:**
- `template_id` - Contract template identifier (e.g., `ct_CON002ABC123DEF456GHI789JKL012`)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/templates/contracts/ct_CON002ABC123DEF456GHI789JKL012" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "id": "ct_CON002ABC123DEF456GHI789JKL012",
    "name": "Wedding Photography Contract",
    "description": "Standard wedding photography service agreement",
    "due_days": 14,
    "status": "active",
    "created_at": "2025-07-15T09:00:00.000000Z",
    "updated_at": "2025-08-01T14:30:00.000000Z",
    "html_body": "<html><head><title>Photography Services Contract</title></head><body><h1>Wedding Photography Services Agreement</h1><p>This contract is between {{studio_name}} and {{client_name}} for photography services on {{event_date}} at {{event_location}}.</p><h2>Services Included</h2><ul><li>{{service_1}}</li><li>{{service_2}}</li></ul><h2>Payment Terms</h2><p>Total contract value: {{total_amount}}</p><p>Deposit required: {{deposit_amount}} due by {{deposit_due_date}}</p><h2>Cancellation Policy</h2><p>{{cancellation_policy}}</p><h2>Signatures</h2><p>Client Signature: ___________________ Date: ___________</p><p>Photographer Signature: ___________________ Date: ___________</p></body></html>",
    "variables": [
      {
        "name": "studio_name",
        "type": "text",
        "required": true,
        "default_value": "{{studio_name}}"
      },
      {
        "name": "client_name",
        "type": "text",
        "required": true,
        "description": "Full name of the client"
      },
      {
        "name": "event_date",
        "type": "date",
        "required": true,
        "description": "Date of the photography session/event"
      },
      {
        "name": "event_location",
        "type": "text",
        "required": false,
        "description": "Location where photography will take place"
      },
      {
        "name": "total_amount",
        "type": "currency",
        "required": true,
        "description": "Total contract amount"
      },
      {
        "name": "deposit_amount",
        "type": "currency",
        "required": false,
        "description": "Required deposit amount"
      }
    ],
    "signers": [
      {
        "type": "client",
        "required": true,
        "order": 1,
        "title": "Client",
        "description": "Primary client signature"
      },
      {
        "type": "photographer",
        "required": true,
        "order": 2,
        "title": "Photographer",
        "description": "Studio photographer signature"
      }
    ],
    "reminders": {
      "enabled": true,
      "days_before_due": [7, 3, 1],
      "reminder_subject": "Contract Signature Required",
      "reminder_message": "Please sign your photography contract by {{due_date}}"
    },
    "document_settings": {
      "allow_comments": true,
      "show_line_numbers": false,
      "watermark": "DRAFT"
    }
  }
}
```

### Update Contract Template

```http
PUT /templates/contracts/{template_id}
```

Update an existing contract template's configuration, content, or settings.

**Path Parameters:**
- `template_id` - Contract template identifier (e.g., `ct_CON002ABC123DEF456GHI789JKL012`)

**Request Body:**
```json
{
  "name": "Updated Wedding Photography Contract",
  "description": "Enhanced wedding photography service agreement with new terms",
  "due_days": 21,
  "status": "active",
  "html_body": "<html><head><title>Photography Services Contract</title></head><body>...</body></html>",
  "signers": [
    {
      "type": "client",
      "required": true,
      "order": 1,
      "title": "Client"
    },
    {
      "type": "photographer",
      "required": true,
      "order": 2,
      "title": "Studio Photographer"
    }
  ],
  "reminders": {
    "enabled": true,
    "days_before_due": [14, 7, 3, 1],
    "reminder_subject": "Important: Contract Signature Required",
    "reminder_message": "Your photography contract requires signature by {{due_date}}. Please review and sign at your earliest convenience."
  },
  "document_settings": {
    "allow_comments": false,
    "show_line_numbers": false,
    "watermark": null
  }
}
```

**Example Request:**
```bash
curl -X PUT "https://studio.pixieset.com/api/v1/templates/contracts/ct_CON002ABC123DEF456GHI789JKL012" \
  -H "Content-Type: application/json" \
  -H "Cookie: session_cookie=your_session" \
  -d '{
    "name": "Updated Wedding Photography Contract",
    "due_days": 21,
    "reminders": {
      "enabled": true,
      "days_before_due": [14, 7, 3, 1]
    }
  }'
```

**Response:**
```json
{
  "data": {
    "id": "ct_CON002ABC123DEF456GHI789JKL012",
    "name": "Updated Wedding Photography Contract",
    "due_days": 21,
    "updated_at": "2025-08-07T15:30:00.000000Z",
    "reminders": {
      "enabled": true,
      "days_before_due": [14, 7, 3, 1]
    }
  }
}
```

## Contract Template Features

### HTML Body with Variable Placeholders

Contract templates support rich HTML content with dynamic variable placeholders:

- **Variables**: Use `{{variable_name}}` syntax for dynamic content
- **Supported types**: text, date, currency, number, boolean
- **Required fields**: Mark variables as required for contract generation
- **Default values**: Set default values for optional variables

### Due Days Configuration

Configure automatic due dates for contract signing:

- **due_days**: Number of days from contract creation to due date
- **Automatic calculation**: Due date calculated as creation_date + due_days
- **Timezone handling**: Respects studio timezone settings

### Document Reminder Settings

Set up automated email reminders for unsigned contracts:

- **Enabled/disabled**: Toggle reminder functionality
- **Multiple reminders**: Set reminders at different intervals (e.g., 7, 3, 1 days before due)
- **Custom messaging**: Customize reminder subject and message content
- **Variable support**: Use placeholders in reminder messages

### Signer Configuration

Define who needs to sign contracts and in what order:

- **Signer types**: client, photographer, witness, etc.
- **Required signatures**: Mark signers as required or optional
- **Signature order**: Control the sequence of signatures
- **Custom titles**: Set display titles for each signer type

## Contract Object

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique contract identifier |
| `contract_number` | string | Human-readable contract number |
| `status` | string | Contract status (draft, sent, viewed, signed, expired) |
| `created_at` | datetime | Creation timestamp |
| `sent_at` | datetime | When contract was sent to client |
| `due_date` | datetime | Contract signing deadline |
| `signed_date` | datetime | When fully signed (all required signatures) |
| `client` | object | Associated client information |
| `template` | object | Source contract template |
| `content` | object | Rendered contract content |
| `signatures` | array | Collection of signatures |

### Contract Status Values

| Status | Description |
|--------|-------------|
| `draft` | Contract created but not sent |
| `sent` | Contract sent to client for signature |
| `viewed` | Client has viewed the contract |
| `partially_signed` | Some but not all required signatures collected |
| `signed` | All required signatures collected |
| `expired` | Contract due date passed without full signature |
| `cancelled` | Contract cancelled by studio or client |

## Contract Template Object

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique template identifier |
| `name` | string | Template name |
| `description` | string | Template description |
| `due_days` | integer | Days until contract due date |
| `status` | string | Template status (active, archived) |
| `html_body` | string | HTML content with variable placeholders |
| `variables` | array | Available template variables |
| `signers` | array | Signer configuration |
| `reminders` | object | Reminder settings |
| `document_settings` | object | Document display settings |

### Variable Object

```json
{
  "name": "client_name",
  "type": "text",
  "required": true,
  "description": "Full name of the client",
  "default_value": "",
  "validation": {
    "min_length": 1,
    "max_length": 100
  }
}
```

### Signer Object

```json
{
  "type": "client",
  "required": true,
  "order": 1,
  "title": "Client",
  "description": "Primary client signature",
  "email_required": true,
  "phone_required": false
}
```

## Integration with Session Types

Contract templates can be associated with session types for automated contract generation during booking:

```json
{
  "session_type": {
    "id": "set_SES001ABC123DEF456GHI789JKL012",
    "name": "Wedding Photography",
    "contract_template_id": "ct_CON002ABC123DEF456GHI789JKL012",
    "auto_send_contract": true,
    "contract_required_for_booking": true
  }
}
```

## Error Handling

Common error responses:

### Contract Not Found (404)
```json
{
  "error": {
    "code": "contract_not_found",
    "message": "Contract with ID co_CON001ABC123DEF456GHI789JKL012 not found"
  }
}
```

### Template Not Found (404)
```json
{
  "error": {
    "code": "template_not_found",
    "message": "Contract template with ID ct_CON002ABC123DEF456GHI789JKL012 not found"
  }
}
```

### Invalid Variable (400)
```json
{
  "error": {
    "code": "invalid_template_variable",
    "message": "Variable 'invalid_var' is not defined in template",
    "details": {
      "available_variables": ["client_name", "event_date", "total_amount"]
    }
  }
}
```

## Best Practices

1. **Use meaningful variable names** - Choose descriptive placeholder names like `{{client_name}}` instead of `{{var1}}`
2. **Test templates thoroughly** - Preview templates with sample data before using in production
3. **Set appropriate due dates** - Allow sufficient time for clients to review and sign contracts
4. **Configure reminders wisely** - Set up reminder schedules that prompt without overwhelming clients
5. **Version control templates** - Keep track of template changes and their effective dates
6. **Handle signature order** - Design workflows that account for multi-party signature requirements
7. **Mobile-friendly content** - Ensure contract HTML renders well on mobile devices
8. **Backup templates** - Regularly export and backup your contract templates
9. **Monitor contract status** - Track contract progress and follow up on overdue signatures
10. **Client communication** - Provide clear instructions to clients about the signing process

## Related Endpoints

- [Clients](/docs/studio-api/clients) - Client management and contract recipients
- [Session Types](/docs/studio-api/sessions) - Booking workflows with contract integration
- [Templates](/docs/studio-api/templates) - Other document template types
- Documents - General document management
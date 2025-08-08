---
sidebar_position: 8
title: Templates
---

# Templates API

Manage reusable templates for emails, contracts, invoices, questionnaires, and quotes in your photography studio workflow.

## Overview

The Templates API provides comprehensive functionality for:
- Creating and managing email templates with HTML content and variable placeholders
- Configuring contract templates with signature requirements and reminder settings
- Setting up invoice templates for consistent billing presentations
- Creating questionnaire templates for client intake forms
- Managing quote templates with customizable pricing structures
- Using variable placeholders for dynamic content personalization

## Template Types & ID Formats

Each template type uses a specific ID prefix for easy identification:

| Template Type | ID Prefix | Example ID |
|---------------|-----------|------------|
| **Email Templates** | `et_` | `et_EML001ABC123DEF456GHI789JKL012` |
| **Contract Templates** | `ct_` | `ct_CON002ABC123DEF456GHI789JKL012` |
| **Invoice Templates** | `itp_` | `itp_INV002ABC123DEF456GHI789JKL01` |
| **Questionnaire Templates** | `qt_` | `qt_QUE002ABC123DEF456GHI789JKL012` |
| **Quote Templates** | `qp_` | `qp_QUO002ABC123DEF456GHI789JKL012` |

## Email Templates

Email templates allow you to create consistent, professional communications with clients using dynamic content and variable placeholders.

### List Email Templates

```http
GET /templates/emails
```

Retrieve a paginated list of all email templates in your studio.

**Query Parameters:**
- `page` - Page number for pagination
- `per_page` - Results per page
- `status` - Filter by template status (`active`, `archived`)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/templates/emails?page=1" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": [
    {
      "id": "et_EML001ABC123DEF456GHI789JKL012",
      "name": "Welcome Email",
      "subject": "Welcome to {{studio_name}} - Let's Get Started!",
      "description": "Initial welcome email sent to new clients",
      "status": "active",
      "created_at": "2025-07-15T09:00:00.000000Z",
      "updated_at": "2025-08-01T14:30:00.000000Z",
      "category": "client_onboarding",
      "variables_count": 8,
      "last_used": "2025-08-06T10:15:00.000000Z"
    },
    {
      "id": "et_EML002ABC123DEF456GHI789JKL012",
      "name": "Session Reminder",
      "subject": "Your {{session_type}} Session is Tomorrow!",
      "description": "Reminder email sent 24 hours before sessions",
      "status": "active",
      "created_at": "2025-07-20T11:15:00.000000Z",
      "updated_at": "2025-08-05T16:45:00.000000Z",
      "category": "session_management",
      "variables_count": 6,
      "last_used": "2025-08-07T08:30:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 12,
    "last_page": 1
  }
}
```

### Get Email Template Details

```http
GET /templates/emails/{template_id}
```

Retrieve detailed information about a specific email template, including the full HTML content and available variables.

**Path Parameters:**
- `template_id` - Email template identifier (e.g., `et_EML001ABC123DEF456GHI789JKL012`)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/templates/emails/et_EML001ABC123DEF456GHI789JKL012" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "id": "et_EML001ABC123DEF456GHI789JKL012",
    "name": "Welcome Email",
    "subject": "Welcome to {{studio_name}} - Let's Get Started!",
    "description": "Initial welcome email sent to new clients",
    "status": "active",
    "category": "client_onboarding",
    "created_at": "2025-07-15T09:00:00.000000Z",
    "updated_at": "2025-08-01T14:30:00.000000Z",
    "html_body": "<html><head><title>Welcome</title></head><body><h1>Welcome {{client_name}}!</h1><p>Thank you for choosing {{studio_name}} for your photography needs. We're excited to work with you!</p><p>Your session is scheduled for {{session_date}} at {{session_time}}.</p><p>Location: {{session_location}}</p><p>If you have any questions, please don't hesitate to contact us at {{studio_email}} or {{studio_phone}}.</p><p>Best regards,<br/>{{photographer_name}}</p></body></html>",
    "text_body": "Welcome {{client_name}}!\n\nThank you for choosing {{studio_name}} for your photography needs...",
    "variables": [
      {
        "name": "studio_name",
        "type": "text",
        "required": true,
        "default_value": "Your Studio Name",
        "description": "Name of your photography studio"
      },
      {
        "name": "client_name",
        "type": "text",
        "required": true,
        "description": "Full name of the client"
      },
      {
        "name": "session_date",
        "type": "date",
        "required": false,
        "format": "F j, Y",
        "description": "Date of the photography session"
      },
      {
        "name": "session_time",
        "type": "time",
        "required": false,
        "format": "g:i A",
        "description": "Time of the photography session"
      },
      {
        "name": "session_location",
        "type": "text",
        "required": false,
        "description": "Location of the photography session"
      }
    ],
    "automation_triggers": [
      "client_created",
      "session_booked"
    ],
    "send_settings": {
      "from_email": "hello@studio.com",
      "from_name": "{{studio_name}}",
      "reply_to": "hello@studio.com",
      "track_opens": true,
      "track_clicks": true
    }
  }
}
```

### Get Email Template Content

```http
GET /templates/emails/{template_id}/fetch_content
```

Fetch the rendered content of an email template with variable placeholders populated using provided data.

**Path Parameters:**
- `template_id` - Email template identifier (e.g., `et_EML001ABC123DEF456GHI789JKL012`)

**Query Parameters:**
- `variables` - JSON object containing variable values for template rendering
- `format` - Response format (`html`, `text`, `both`) - default: `both`

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/templates/emails/et_EML001ABC123DEF456GHI789JKL012/fetch_content?variables={'client_name':'John Doe','studio_name':'Pixel Perfect Studio'}" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "subject": "Welcome to Pixel Perfect Studio - Let's Get Started!",
    "html_content": "<html><head><title>Welcome</title></head><body><h1>Welcome John Doe!</h1><p>Thank you for choosing Pixel Perfect Studio for your photography needs...</p></body></html>",
    "text_content": "Welcome John Doe!\n\nThank you for choosing Pixel Perfect Studio for your photography needs...",
    "rendered_variables": {
      "studio_name": "Pixel Perfect Studio",
      "client_name": "John Doe",
      "session_date": null,
      "session_time": null,
      "session_location": null
    },
    "missing_variables": [
      "session_date",
      "session_time",
      "session_location"
    ]
  }
}
```

## Contract Templates

Contract templates are covered in detail in the [Contracts documentation](/docs/studio-api/contracts#contract-templates). Key features include:

- **HTML body with variable placeholders** for dynamic content
- **Due days configuration** for automatic deadline calculation
- **Signature requirements** with multi-party signing workflow
- **Reminder settings** with automated email notifications
- **Template ID format**: `ct_` prefix (e.g., `ct_CON002ABC123DEF456GHI789JKL012`)

### Quick Reference

```http
GET /templates/contracts          # List contract templates
GET /templates/contracts/{id}     # Get contract template details
PUT /templates/contracts/{id}     # Update contract template
```

## Invoice Templates

Invoice templates provide consistent formatting and branding for client billing documents.

### List Invoice Templates

```http
GET /templates/invoices
```

Retrieve a list of all invoice templates available in your studio.

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/templates/invoices" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": [
    {
      "id": "itp_INV002ABC123DEF456GHI789JKL01",
      "name": "Standard Invoice Template",
      "description": "Default invoice template with studio branding",
      "status": "active",
      "is_default": true,
      "created_at": "2025-07-15T09:00:00.000000Z",
      "updated_at": "2025-08-01T14:30:00.000000Z",
      "currency": "USD",
      "tax_inclusive": false,
      "show_tax_breakdown": true,
      "payment_terms_days": 30,
      "late_fee_enabled": true,
      "late_fee_percentage": 1.5
    },
    {
      "id": "itp_INV003ABC123DEF456GHI789JKL01",
      "name": "Wedding Invoice Template",
      "description": "Specialized template for wedding photography services",
      "status": "active",
      "is_default": false,
      "created_at": "2025-07-20T11:15:00.000000Z",
      "updated_at": "2025-08-05T16:45:00.000000Z",
      "currency": "USD",
      "tax_inclusive": false,
      "show_tax_breakdown": true,
      "payment_terms_days": 14,
      "late_fee_enabled": false
    }
  ],
  "meta": {
    "total": 2,
    "default_template_id": "itp_INV002ABC123DEF456GHI789JKL01"
  }
}
```

### Get Invoice Template Details

```http
GET /templates/invoices/{template_id}
```

Retrieve detailed information about a specific invoice template, including layout, styling, and variable configurations.

**Path Parameters:**
- `template_id` - Invoice template identifier (e.g., `itp_INV002ABC123DEF456GHI789JKL01`)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/templates/invoices/itp_INV002ABC123DEF456GHI789JKL01" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "id": "itp_INV002ABC123DEF456GHI789JKL01",
    "name": "Standard Invoice Template",
    "description": "Default invoice template with studio branding",
    "status": "active",
    "is_default": true,
    "created_at": "2025-07-15T09:00:00.000000Z",
    "updated_at": "2025-08-01T14:30:00.000000Z",
    "layout_settings": {
      "header_logo": true,
      "header_logo_url": "https://studio.pixieset.com/assets/logo.png",
      "header_text": "{{studio_name}}",
      "show_invoice_number": true,
      "show_due_date": true,
      "show_issue_date": true,
      "color_scheme": "modern_blue",
      "font_family": "Arial, sans-serif"
    },
    "content_settings": {
      "show_line_item_descriptions": true,
      "show_line_item_quantities": true,
      "show_line_item_rates": true,
      "show_subtotal": true,
      "show_tax_breakdown": true,
      "show_total": true,
      "currency": "USD",
      "currency_position": "before",
      "decimal_places": 2
    },
    "payment_settings": {
      "payment_terms_days": 30,
      "payment_instructions": "Payment is due within {{payment_terms}} days of invoice date.",
      "late_fee_enabled": true,
      "late_fee_percentage": 1.5,
      "late_fee_description": "Late fee of {{late_fee_percentage}}% per month will be applied to overdue invoices.",
      "accepted_payment_methods": [
        "credit_card",
        "paypal",
        "bank_transfer",
        "check"
      ]
    },
    "footer_settings": {
      "footer_text": "Thank you for your business!",
      "contact_info": {
        "email": "{{studio_email}}",
        "phone": "{{studio_phone}}",
        "address": "{{studio_address}}"
      },
      "social_links": {
        "website": "{{studio_website}}",
        "instagram": "{{studio_instagram}}"
      }
    },
    "variables": [
      {
        "name": "studio_name",
        "type": "text",
        "required": true,
        "default_value": "Your Studio Name",
        "description": "Name of your photography studio"
      },
      {
        "name": "studio_email",
        "type": "email",
        "required": true,
        "description": "Studio contact email address"
      },
      {
        "name": "payment_terms",
        "type": "number",
        "required": false,
        "default_value": 30,
        "description": "Number of days for payment terms"
      }
    ]
  }
}
```

## Questionnaire Templates

Questionnaire templates enable you to create standardized intake forms for collecting client information before sessions.

### List Questionnaire Templates

```http
GET /templates/questionnaires
```

Retrieve a list of all questionnaire templates in your studio.

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/templates/questionnaires" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": [
    {
      "id": "qt_QUE002ABC123DEF456GHI789JKL012",
      "name": "Wedding Photography Questionnaire",
      "description": "Comprehensive questionnaire for wedding clients",
      "status": "active",
      "created_at": "2025-07-15T09:00:00.000000Z",
      "updated_at": "2025-08-01T14:30:00.000000Z",
      "questions_count": 15,
      "required_questions_count": 8,
      "estimated_completion_time": 10,
      "category": "wedding",
      "auto_send_with_contract": true
    },
    {
      "id": "qt_QUE003ABC123DEF456GHI789JKL012",
      "name": "Family Portrait Questionnaire",
      "description": "Essential questions for family photography sessions",
      "status": "active",
      "created_at": "2025-07-20T11:15:00.000000Z",
      "updated_at": "2025-08-05T16:45:00.000000Z",
      "questions_count": 8,
      "required_questions_count": 4,
      "estimated_completion_time": 5,
      "category": "family",
      "auto_send_with_contract": false
    }
  ],
  "meta": {
    "total": 2
  }
}
```

### Get Questionnaire Template Details

```http
GET /templates/questionnaires/{template_id}
```

Retrieve detailed information about a specific questionnaire template, including all questions, field types, and validation rules.

**Path Parameters:**
- `template_id` - Questionnaire template identifier (e.g., `qt_QUE002ABC123DEF456GHI789JKL012`)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/templates/questionnaires/qt_QUE002ABC123DEF456GHI789JKL012" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "id": "qt_QUE002ABC123DEF456GHI789JKL012",
    "name": "Wedding Photography Questionnaire",
    "description": "Comprehensive questionnaire for wedding clients",
    "status": "active",
    "created_at": "2025-07-15T09:00:00.000000Z",
    "updated_at": "2025-08-01T14:30:00.000000Z",
    "category": "wedding",
    "estimated_completion_time": 10,
    "auto_send_with_contract": true,
    "questions": [
      {
        "id": "q1",
        "order": 1,
        "question_text": "What is your wedding date?",
        "field_type": "date",
        "required": true,
        "description": "The scheduled date of your wedding ceremony",
        "validation": {
          "min_date": "today",
          "max_date": "+2 years"
        }
      },
      {
        "id": "q2",
        "order": 2,
        "question_text": "What is your wedding venue?",
        "field_type": "text",
        "required": true,
        "description": "Name and location of your wedding venue",
        "validation": {
          "min_length": 5,
          "max_length": 200
        }
      },
      {
        "id": "q3",
        "order": 3,
        "question_text": "How many guests will attend?",
        "field_type": "number",
        "required": false,
        "description": "Approximate number of wedding guests",
        "validation": {
          "min_value": 1,
          "max_value": 1000
        }
      },
      {
        "id": "q4",
        "order": 4,
        "question_text": "What photography style do you prefer?",
        "field_type": "select",
        "required": true,
        "options": [
          { "value": "traditional", "label": "Traditional/Classic" },
          { "value": "photojournalistic", "label": "Photojournalistic/Documentary" },
          { "value": "fine_art", "label": "Fine Art" },
          { "value": "lifestyle", "label": "Lifestyle/Natural" },
          { "value": "mix", "label": "Mix of styles" }
        ]
      },
      {
        "id": "q5",
        "order": 5,
        "question_text": "Tell us about your love story",
        "field_type": "textarea",
        "required": false,
        "description": "Share how you met and what makes your relationship special",
        "validation": {
          "max_length": 1000
        }
      }
    ],
    "completion_settings": {
      "thank_you_message": "Thank you for completing our questionnaire! We'll use this information to make your wedding photography perfect.",
      "redirect_url": null,
      "send_confirmation_email": true,
      "confirmation_email_template": "et_ConfirmQuestComplete"
    },
    "variables": [
      {
        "name": "client_name",
        "source": "client.full_name",
        "description": "Full name of the client"
      },
      {
        "name": "wedding_date",
        "source": "answers.q1",
        "description": "Wedding date from questionnaire"
      },
      {
        "name": "venue_name",
        "source": "answers.q2",
        "description": "Wedding venue from questionnaire"
      }
    ]
  }
}
```

## Quote Templates

Quote templates allow you to create professional, branded quotes for potential clients with consistent pricing structures and terms.

### List Quote Templates

```http
GET /templates/quotes
```

Retrieve a list of all quote templates available in your studio.

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/templates/quotes" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": [
    {
      "id": "qp_QUO002ABC123DEF456GHI789JKL012",
      "name": "Wedding Photography Package Quote",
      "description": "Standard quote template for wedding photography services",
      "status": "active",
      "is_default": true,
      "created_at": "2025-07-15T09:00:00.000000Z",
      "updated_at": "2025-08-01T14:30:00.000000Z",
      "category": "wedding",
      "validity_days": 30,
      "auto_convert_to_invoice": true,
      "requires_approval": true,
      "package_items_count": 5
    },
    {
      "id": "qp_QUO003ABC123DEF456GHI789JKL012",
      "name": "Portrait Session Quote",
      "description": "Quote template for individual and family portrait sessions",
      "status": "active",
      "is_default": false,
      "created_at": "2025-07-20T11:15:00.000000Z",
      "updated_at": "2025-08-05T16:45:00.000000Z",
      "category": "portrait",
      "validity_days": 14,
      "auto_convert_to_invoice": false,
      "requires_approval": false,
      "package_items_count": 3
    }
  ],
  "meta": {
    "total": 2,
    "default_template_id": "qp_QUO002ABC123DEF456GHI789JKL012"
  }
}
```

### Get Quote Template Details

```http
GET /templates/quotes/{template_id}
```

Retrieve detailed information about a specific quote template, including package items, pricing, and terms.

**Path Parameters:**
- `template_id` - Quote template identifier (e.g., `qp_QUO002ABC123DEF456GHI789JKL012`)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/templates/quotes/qp_QUO002ABC123DEF456GHI789JKL012" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "id": "qp_QUO002ABC123DEF456GHI789JKL012",
    "name": "Wedding Photography Package Quote",
    "description": "Standard quote template for wedding photography services",
    "status": "active",
    "is_default": true,
    "created_at": "2025-07-15T09:00:00.000000Z",
    "updated_at": "2025-08-01T14:30:00.000000Z",
    "category": "wedding",
    "validity_days": 30,
    "auto_convert_to_invoice": true,
    "requires_approval": true,
    "layout_settings": {
      "header_logo": true,
      "header_logo_url": "https://studio.pixieset.com/assets/logo.png",
      "color_scheme": "elegant_gold",
      "font_family": "Georgia, serif",
      "show_item_descriptions": true,
      "show_item_images": true,
      "show_package_summary": true
    },
    "package_items": [
      {
        "id": "pi1",
        "name": "Full Wedding Day Coverage",
        "description": "Complete photography coverage from getting ready to reception",
        "base_price": 250000,
        "formatted_price": "$2,500.00",
        "is_required": true,
        "quantity_editable": false,
        "default_quantity": 1,
        "category": "photography"
      },
      {
        "id": "pi2",
        "name": "Engagement Session",
        "description": "Pre-wedding engagement photography session",
        "base_price": 50000,
        "formatted_price": "$500.00",
        "is_required": false,
        "quantity_editable": false,
        "default_quantity": 1,
        "category": "photography"
      },
      {
        "id": "pi3",
        "name": "Wedding Album",
        "description": "Professional wedding album with 50 images",
        "base_price": 75000,
        "formatted_price": "$750.00",
        "is_required": false,
        "quantity_editable": true,
        "default_quantity": 1,
        "max_quantity": 5,
        "category": "products"
      }
    ],
    "terms_and_conditions": {
      "validity_period": "This quote is valid for {{validity_days}} days from the date of issue.",
      "payment_terms": "50% deposit required to secure booking, balance due 30 days after delivery.",
      "cancellation_policy": "Cancellation more than 90 days before event: full refund minus $200 processing fee. 30-90 days: 50% refund. Less than 30 days: no refund.",
      "travel_fees": "Travel fees may apply for locations more than 50 miles from studio.",
      "additional_hours": "Additional hours beyond package: $150/hour",
      "copyright_notice": "All images remain property of {{studio_name}}. Client receives usage rights as specified in contract."
    },
    "pricing_settings": {
      "currency": "USD",
      "tax_inclusive": false,
      "tax_rate": 8.25,
      "show_tax_breakdown": true,
      "discount_allowed": true,
      "max_discount_percentage": 20,
      "payment_plan_available": true,
      "deposit_percentage": 50
    },
    "variables": [
      {
        "name": "studio_name",
        "type": "text",
        "required": true,
        "default_value": "Your Studio Name",
        "description": "Name of your photography studio"
      },
      {
        "name": "client_name",
        "type": "text",
        "required": true,
        "description": "Full name of the client"
      },
      {
        "name": "validity_days",
        "type": "number",
        "required": false,
        "default_value": 30,
        "description": "Number of days quote is valid"
      },
      {
        "name": "event_date",
        "type": "date",
        "required": false,
        "description": "Date of the event/session"
      }
    ]
  }
}
```

## Template Features

### Variable Placeholders

All template types support dynamic content through variable placeholders using `{{variable_name}}` syntax:

**Common Variable Types:**
- **text** - Plain text fields
- **email** - Email addresses with validation
- **date** - Date fields with formatting options
- **time** - Time fields with formatting
- **number** - Numeric values with validation
- **currency** - Monetary amounts with currency formatting
- **boolean** - True/false values
- **url** - Web addresses with validation

**Example Variable Configuration:**
```json
{
  "name": "session_date",
  "type": "date",
  "required": true,
  "format": "F j, Y",
  "description": "Date of the photography session",
  "validation": {
    "min_date": "today",
    "max_date": "+1 year"
  },
  "default_value": null
}
```

### HTML Body Support

Email, contract, and other content templates support rich HTML formatting:
- **Responsive design** for mobile and desktop viewing
- **Embedded CSS** for consistent styling
- **Image embedding** with hosted URLs
- **Variable substitution** within HTML content
- **Preview functionality** for testing before sending

### Reminder Settings

Templates can be configured with automated reminder systems:
- **Multiple reminder schedules** (e.g., 7, 3, 1 days before due date)
- **Custom reminder messages** with variable placeholders
- **Escalation sequences** for overdue items
- **Delivery tracking** with open and click metrics

### Status Management

All templates support status tracking:
- **active** - Template is available for use
- **archived** - Template is hidden but preserved
- **draft** - Template is in development
- **locked** - Template is protected from editing

## Common Template Operations

### Template Validation

Before using templates, the system validates:
- **Required variables** are provided
- **Variable types** match expected formats
- **HTML syntax** is valid and safe
- **Image URLs** are accessible
- **Email addresses** are properly formatted

### Template Preview

Generate previews with sample data:
```bash
curl -X POST "https://studio.pixieset.com/api/v1/templates/{type}/{id}/preview" \
  -H "Content-Type: application/json" \
  -H "Cookie: session_cookie=your_session" \
  -d '{
    "variables": {
      "client_name": "Jane Smith",
      "studio_name": "Professional Photography Studio",
      "session_date": "2025-09-15"
    },
    "format": "html"
  }'
```

### Template Usage Analytics

Track template performance:
- **Usage frequency** - How often templates are used
- **Success rates** - Completion rates for contracts/questionnaires
- **Client engagement** - Open and click rates for emails
- **Response times** - Average time to complete forms

## Error Handling

Common template-related errors:

### Template Not Found (404)
```json
{
  "error": {
    "code": "template_not_found",
    "message": "Template with ID et_EML001ABC123DEF456GHI789JKL012 not found",
    "type": "email_template"
  }
}
```

### Missing Required Variables (400)
```json
{
  "error": {
    "code": "missing_required_variables",
    "message": "Required template variables are missing",
    "missing_variables": ["client_name", "session_date"],
    "template_id": "et_EML001ABC123DEF456GHI789JKL012"
  }
}
```

### Invalid Variable Type (400)
```json
{
  "error": {
    "code": "invalid_variable_type",
    "message": "Variable 'session_date' expects date format, received 'next Tuesday'",
    "variable_name": "session_date",
    "expected_type": "date",
    "received_value": "next Tuesday"
  }
}
```

## Best Practices

1. **Use descriptive variable names** - Choose clear, meaningful placeholder names
2. **Test with sample data** - Preview templates with realistic test data before deployment
3. **Keep content concise** - Ensure templates are readable and mobile-friendly
4. **Version control templates** - Track changes and maintain backup copies
5. **Validate HTML content** - Test rendering across different email clients and devices
6. **Set appropriate defaults** - Provide sensible default values for optional variables
7. **Monitor template performance** - Track usage and engagement metrics
8. **Regular template audits** - Review and update templates periodically
9. **Client feedback integration** - Incorporate client preferences into template designs
10. **Backup and export** - Regularly export templates for safekeeping

## Related Endpoints

- [Clients](/docs/studio-api/clients) - Client data for template personalization
- [Contracts](/docs/studio-api/contracts) - Contract generation using templates
- [Invoices](/docs/studio-api/invoices) - Invoice creation with templates
- [Sessions](/docs/studio-api/sessions) - Session booking with questionnaire templates
- [Conversations](/docs/studio-api/conversations) - Email communication using templates
---
sidebar_position: 9
title: "Questionnaires"
---

# Questionnaires

Questionnaires are documents sent to clients to gather information before or after sessions. They are based on questionnaire templates and can be associated with session types for automated sending.

## Endpoints

### List Questionnaires

Retrieve a list of all questionnaires.

```http
GET /questionnaires/
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `expand` | string | Include additional data. Use `client` to include client information. |

#### Example Request

```bash
curl -X GET "https://studio.pixieset.com/api/v1/questionnaires/?expand=client" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

#### Example Response

```json
{
  "data": [
    {
      "id": "qu_QUE001ABC123DEF456GHI789JKL012",
      "status": "pending",
      "created_at": "2025-08-06T14:30:00.000000Z",
      "updated_at": "2025-08-06T14:30:00.000000Z",
      "due_date": "2025-08-13T23:59:59.000000Z",
      "template": {
        "id": "qt_QUE002ABC123DEF456GHI789JKL012",
        "name": "Wedding Photography Questionnaire"
      },
      "client": {
        "id": "cl_ABC123DEF456GHI789JKL012MNO345",
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "per_page": 25,
    "to": 1,
    "total": 1
  }
}
```

### Get Questionnaire Details

Retrieve detailed information about a specific questionnaire.

```http
GET /questionnaires/{questionnaire_id}
```

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `questionnaire_id` | string | The unique questionnaire identifier (format: `qu_` + 30 alphanumeric characters) |

#### Example Request

```bash
curl -X GET "https://studio.pixieset.com/api/v1/questionnaires/qu_QUE001ABC123DEF456GHI789JKL012" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

#### Example Response

```json
{
  "data": {
    "id": "qu_QUE001ABC123DEF456GHI789JKL012",
    "status": "completed",
    "created_at": "2025-08-06T14:30:00.000000Z",
    "updated_at": "2025-08-07T09:15:00.000000Z",
    "completed_at": "2025-08-07T09:15:00.000000Z",
    "due_date": "2025-08-13T23:59:59.000000Z",
    "template": {
      "id": "qt_QUE002ABC123DEF456GHI789JKL012",
      "name": "Wedding Photography Questionnaire",
      "description": "Comprehensive questionnaire for wedding photography clients"
    },
    "client": {
      "id": "cl_ABC123DEF456GHI789JKL012MNO345",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com",
      "phone": "+1 (555) 123-4567"
    },
    "responses": [
      {
        "field_name": "wedding_date",
        "field_label": "Wedding Date",
        "response": "2025-09-15"
      },
      {
        "field_name": "venue_name",
        "field_label": "Venue Name",
        "response": "Grand Ballroom Hotel"
      }
    ]
  }
}
```

## Questionnaire ID Format

Questionnaire IDs follow the format: `qu_` followed by 30 alphanumeric characters.

**Example:** `qu_QUE001ABC123DEF456GHI789JKL012`

## Common Query Parameters

### expand Parameter

Use the `expand` parameter to include additional related data in the response:

- `client`: Include detailed client information
- `template`: Include questionnaire template details
- `responses`: Include all questionnaire responses (for detailed view)

**Example:**
```http
GET /questionnaires/?expand=client
```

## Questionnaire Status

Questionnaires can have the following statuses:

- `draft`: Questionnaire created but not yet sent
- `pending`: Sent to client, awaiting completion
- `completed`: Client has filled out and submitted the questionnaire
- `expired`: Questionnaire due date has passed without completion

## Relationship with Templates

Questionnaires are instances of [questionnaire templates](./templates.md#questionnaire-templates). The template defines:

- Questions and field types
- Styling and branding
- Default due date settings
- Required vs optional fields

When a questionnaire is created from a template, it inherits the template's configuration but becomes an independent document that can be customized for the specific client.

## Integration with Session Types

Questionnaires can be automatically associated with [session types](./sessions.md) to streamline the booking process:

1. **Pre-session questionnaires**: Automatically sent when a session is booked
2. **Post-session questionnaires**: Sent after session completion for feedback
3. **Custom timing**: Configure when questionnaires are sent relative to the session date

## Best Practices

1. **Clear Due Dates**: Set appropriate due dates to ensure clients complete questionnaires on time
2. **Template Reuse**: Create reusable templates for different photography types (wedding, portrait, corporate)
3. **Client Communication**: Use the expand parameter to get client details for personalized follow-ups
4. **Status Monitoring**: Regularly check questionnaire status to follow up on pending submissions

## Related Endpoints

- [Questionnaire Templates](./templates.md#questionnaire-templates) - Manage reusable questionnaire templates
- [Session Types](./sessions.md) - Configure automatic questionnaire sending
- [Clients](./clients.md) - Manage client information associated with questionnaires
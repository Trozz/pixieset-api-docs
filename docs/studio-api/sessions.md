---
sidebar_position: 3
title: Sessions & Booking
---

# Sessions & Booking API

Manage photography sessions, scheduling, and availability.

## Session Types

Session types define the services you offer with scheduling, pricing, and booking rules.

### List Session Types

```http
GET /session_types/
```

Returns all session types with detailed configuration including:
- Basic info (name, status, description, location)
- Scheduling settings (duration, buffers, notice periods)
- Payment configuration (amounts, methods, currency)
- Intake form fields
- Cancellation and reschedule policies
- Associated templates (contract, questionnaire)

### Get Session Type Details

```http
GET /session_types/{session_type_id}
```

**Path Parameters:**
- `session_type_id` - Session type identifier (e.g., `set_SES001ABC123DEF456GHI789JKL012`)

### Create Session Type

```http
POST /session_types
```

**Request Body:**
```json
{
  "name": "Wedding Photography",
  "duration": 480,
  "location": "On-site",
  "description": "Full day wedding coverage",
  "payment_amount_full": 250000,
  "currency": "gbp",
  "collect_payment": 1,
  "minimum_notice_duration": 30,
  "maximum_notice_duration": 365
}
```

### Update Session Type

```http
PUT /session_types/{session_type_id}
```

### Delete Session Type

```http
DELETE /session_types/{session_type_id}
```

### Update Session Type Status

```http
PUT /session_types/{session_type_id}/update_status
```

## Availability Management

### Check Day Availability

```http
GET /session_types/{session_type_id}/check-day-avail/{date-timezone}
```

**Path Format:** `2025-8-7-Europe/London`

### Check Month Availability

```http
GET /session_types/{session_type_id}/check-month-avail/{month-timezone}
```

**Path Format:** `2025-8-Europe/London`

## Session Type Schedules

### List Schedules

```http
GET /session_type_schedules/
```

### Get Schedule Interval Overrides

```http
GET /session_type_schedules/{schedule_id}/interval_overrides/
GET /session_type_schedules/{schedule_id}/interval_overrides_list/
```

**Schedule ID Format:** `sch_SCH001ABC123DEF456GHI789JKL012`

### Update Schedule Interval

```http
PUT /session_type_schedules/{schedule_id}/session_type_schedule_intervals/{interval_id}
```

**Interval ID Format:** `sa_SCH002ABC123DEF456GHI789JKL012`

## Sessions

### List Sessions

```http
GET /sessions
```

Returns all booked sessions with client and session type information.

### Get Inquiry Count

```http
GET /sessions/inquiry/count
```

Returns the count of pending session inquiries.

## Templates Association

### Update Contract Template

```http
PUT /session_types/{session_type_id}/templates/contract/{contract_id}
```

### Update Questionnaire Template

```http
PUT /session_types/{session_type_id}/templates/questionnaire/{questionnaire_id}
```

## Tax Configuration

### Manage Session Type Taxes

```http
POST /session_types/{session_type_id}/taxes
```

## Session Type Object

### Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Session type name |
| `status` | string | published/draft |
| `duration` | integer | Duration in minutes |
| `location` | string | Location details |
| `description` | string | Full description |
| `payment_amount_full` | integer | Full payment amount (in cents/pence) |
| `payment_amount_partial` | integer | Deposit amount |
| `currency` | string | Currency code (gbp, usd, etc.) |
| `collect_payment` | boolean | Whether to collect payment |
| `minimum_notice_duration` | integer | Minimum booking notice (days) |
| `maximum_notice_duration` | integer | Maximum advance booking (days) |

### Payment Methods Configuration

```json
{
  "payment_methods": [
    {
      "name": "Pixieset Payments",
      "enabled": false,
      "type": "pixieset-payments"
    },
    {
      "name": "Bank Transfer",
      "enabled": true,
      "type": "manual",
      "instructions": "Payment details here"
    }
  ]
}
```

### Scheduling Configuration

```json
{
  "session_type_schedule": {
    "id": "sch_SCH003ABC123DEF456GHI789JKL012",
    "name": "Schedule Name",
    "schedule_type": "custom",
    "display_timezone": "Europe/London",
    "session_type_schedule_intervals": []
  }
}
```

## Best Practices

1. **Set appropriate notice periods** - Balance convenience with preparation time
2. **Configure payment methods** - Enable appropriate payment options
3. **Use templates** - Associate contracts and questionnaires
4. **Set clear cancellation policies** - Define rules upfront
5. **Test availability** - Verify schedule configuration works as expected
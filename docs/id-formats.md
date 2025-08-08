---
sidebar_position: 10
title: ID Format Reference
---

# ID Format Reference

All Pixieset API resources use consistent ID formats with specific prefixes to identify resource types.

## Studio API ID Formats

| Resource Type | Prefix | Example | Length |
|--------------|--------|---------|--------|
| Client | `cl_` | `cl_ABC123DEF456GHI789JKL012MNO345` | 30 chars after prefix |
| Invoice | `in_` | `in_INV001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Invoice Item | `ii_` | `ii_ITM001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Payment | `ip_` | `ip_PAY001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Coupon | `cou_` | `cou_COU001ABC123DEF456GHI789JKL01` | 30 chars after prefix |
| Session Type | `set_` | `set_SES001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Session | `ses_` | `ses_SES002ABC123DEF456GHI789JKL01` | 30 chars after prefix |
| Schedule | `sch_` | `sch_SCH001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Schedule Interval | `sa_` | `sa_SCH002ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Project Type | `prt_` | `prt_PRJ001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Contact Form | `cf_` | `cf_CNT001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Contract | `co_` | `co_CON001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Contract Template | `ct_` | `ct_CON002ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Questionnaire | `qu_` | `qu_QUE001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Questionnaire Template | `qt_` | `qt_QUE002ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Quote | `qo_` | `qo_QUO001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Quote Template | `qp_` | `qp_QUO002ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Email Template | `et_` | `et_EML001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Invoice Template | `itp_` | `itp_INV002ABC123DEF456GHI789JKL01` | 30 chars after prefix |
| Google Calendar Settings | `gs_` | `gs_CAL001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| User Manual Payment Method | `ump_` | `ump_PAY002ABC123DEF456GHI789JKL01` | 30 chars after prefix |
| Session Manual Payment Method | `smp_` | `smp_PAY003ABC123DEF456GHI789JKL01` | 30 chars after prefix |
| User Image Asset | `ui_` | `ui_IMG001ABC123DEF456GHI789JKL012` | 30 chars after prefix |
| Gift Card | `gc_` | `gc_GFT001ABC123DEF456GHI789JKL012` | 30 chars after prefix |

## Gallery API ID Formats

| Resource Type | Prefix | Example | Length |
|--------------|--------|---------|--------|
| Collection | - | `90516387` | Numeric, 8 digits |
| Gallery | - | `129003127` | Numeric, 9 digits |
| Photo | - | Numeric ID | Variable |
| Conversation | - | `examplestudio_abc123def456` | Username + underscore + ID |

## ID Format Patterns

### Alphanumeric IDs (Studio API)
Most Studio API resources use a consistent pattern:
- **Prefix**: 2-4 lowercase letters followed by underscore
- **Identifier**: 30 alphanumeric characters (mix of uppercase, lowercase, and numbers)
- **Total Length**: Prefix length + underscore + 30 characters

Example breakdown:
```
cl_ABC123DEF456GHI789JKL012MNO345
│  │
│  └─ 30 character unique identifier
└─ Resource type prefix
```

### Numeric IDs (Gallery API)
Gallery API primarily uses numeric IDs:
- Collections: 8-digit numbers
- Galleries: 9-digit numbers
- No prefixes for most resources

### Special Format: Conversations
Conversations in Gallery API use a compound format:
```
{username}_{unique_id}
```
Example: `examplestudio_abc123def456`

## Usage in API Calls

### Path Parameters
IDs are used in URL paths:
```http
GET /clients/{client_id}
GET /collections/{collection_id}
```

### Query Parameters
IDs used for filtering:
```http
GET /conversations/?client_id=cl_XYZ789DEF456GHI123JKL456MNO789
```

### Request Bodies
IDs referenced in POST/PUT requests:
```json
{
  "client_id": "cl_ABC123DEF456GHI789JKL012MNO345",
  "session_type_id": "set_SES001ABC123DEF456GHI789JKL012"
}
```

## Validation Tips

1. **Check prefix**: Ensure the ID starts with the correct prefix for the resource type
2. **Verify length**: Most Studio API IDs have exactly 30 characters after the prefix
3. **Case sensitivity**: IDs are case-sensitive - preserve exact casing
4. **No modification**: Never modify or truncate IDs
5. **Store as strings**: Always store IDs as strings, even numeric ones

## Common Errors

### Invalid ID Format
```json
{
  "error": "Invalid client ID format",
  "message": "Client ID must start with 'cl_' prefix"
}
```

### Resource Not Found
```json
{
  "error": "Resource not found",
  "message": "No client found with ID: cl_InvalidID123"
}
```

## Best Practices

1. **Validate IDs client-side** before making API calls
2. **Store IDs unchanged** from API responses
3. **Use constants** for ID prefixes in your code
4. **Implement ID validation** functions for each resource type
5. **Handle ID-related errors** gracefully in your application

## Related Documentation

- [Authentication](/docs/authentication) - Using IDs in authenticated requests
- [Error Handling](/docs/error-handling) - Handling ID-related errors
- [Studio API Overview](/docs/studio-api/overview) - Studio resource IDs
- [Gallery API Overview](/docs/gallery-api/overview) - Gallery resource IDs
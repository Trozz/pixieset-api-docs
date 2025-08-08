---
sidebar_position: 4
title: Invoices & Payments
---

# Invoices & Payments API

Manage invoicing, payment processing, and financial operations for your photography business.

## Overview

The Invoices & Payments API provides comprehensive functionality for:
- Creating and managing invoices
- Processing payments and tracking transactions
- Handling currency conversions and multiple currencies
- Managing disputed payments and refunds
- Generating financial summaries and reports

## Currency Handling

All monetary amounts in the API are expressed in the **smallest currency unit**:
- **USD**: Amounts in cents (e.g., 5000 = $50.00)
- **GBP**: Amounts in pence (e.g., 2500 = £25.00)
- **EUR**: Amounts in cents (e.g., 7500 = €75.00)

## ID Formats

- **Invoice ID**: `in_` prefix + 30 alphanumeric characters (e.g., `in_INV001ABC123DEF456GHI789JKL012`)
- **Payment ID**: `ip_` prefix + 30 alphanumeric characters (e.g., `ip_PAY001ABC123DEF456GHI789JKL012`)

## Endpoints

### List Invoices

```http
GET /invoices/
```

Retrieve a paginated list of invoices with filtering options.

**Query Parameters:**
- `expand` - Include additional data (`client` to include client info)
- `timeframe_filter` - Time period filter (`all_time`, `this_month`, `last_month`, etc.)
- `to` - End date filter (YYYY-MM-DD format)
- `currency` - Filter by currency code (`usd`, `gbp`, `eur`, etc.)
- `payment_type` - Payment type filter (`all`, `paid`, `unpaid`, `overdue`)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/invoices/?expand=client&currency=gbp&payment_type=all" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": [
    {
      "id": "in_INV001ABC123DEF456GHI789JKL012",
      "invoice_number": "INV-001",
      "amount": 50000,
      "amount_formatted": "£500.00",
      "currency": "gbp",
      "status": "paid",
      "due_date": "2025-09-07",
      "created_at": "2025-08-07T14:30:00.000000Z",
      "client": {
        "id": "cl_ABC123DEF456GHI789JKL012MNO345",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 109
  }
}
```

### Get Invoice Details

```http
GET /invoices/{invoice_id}
```

Retrieve detailed information about a specific invoice.

**Path Parameters:**
- `invoice_id` - Invoice identifier (e.g., `in_INV001ABC123DEF456GHI789JKL012`)

**Query Parameters:**
- `expand` - Include all related data (`all` for complete invoice details)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/invoices/in_INV001ABC123DEF456GHI789JKL012?expand=all" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "id": "in_INV001ABC123DEF456GHI789JKL012",
    "invoice_number": "INV-001",
    "amount": 50000,
    "amount_formatted": "£500.00",
    "currency": "gbp",
    "status": "paid",
    "due_date": "2025-09-07",
    "created_at": "2025-08-07T14:30:00.000000Z",
    "client": {
      "id": "cl_ABC123DEF456GHI789JKL012MNO345",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    },
    "line_items": [
      {
        "id": "li_abc123",
        "name": "Wedding Photography Package",
        "quantity": 1,
        "amount": 45000,
        "amount_formatted": "£450.00",
        "taxable": true
      },
      {
        "id": "li_def456",
        "name": "Travel Fee",
        "quantity": 1,
        "amount": 5000,
        "amount_formatted": "£50.00",
        "taxable": false
      }
    ],
    "payments": [
      {
        "id": "ip_PAY001ABC123DEF456GHI789JKL012",
        "amount": 50000,
        "amount_formatted": "£500.00",
        "payment_date": "2025-08-10T10:15:00.000000Z",
        "status": "completed"
      }
    ],
    "associated_documents": []
  }
}
```

### Get Invoice Summary

```http
GET /invoices/invoice_summary
```

Retrieve summary statistics for invoices within a specified time period.

**Query Parameters:**
- `timeframe_filter` - Time period (`all_time`, `this_month`, `last_month`, etc.)
- `to` - End date (YYYY-MM-DD format)
- `currency` - Currency code filter
- `payment_type` - Payment type filter

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/invoices/invoice_summary?timeframe_filter=this_month&currency=gbp" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "total_invoices": 15,
    "total_amount": 125000,
    "total_amount_formatted": "£1,250.00",
    "paid_amount": 100000,
    "paid_amount_formatted": "£1,000.00",
    "unpaid_amount": 25000,
    "unpaid_amount_formatted": "£250.00",
    "overdue_count": 2,
    "currency": "gbp"
  }
}
```

### List Available Currencies

```http
GET /invoices/currencies/list
```

Get a list of all supported currencies for invoicing.

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/invoices/currencies/list" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": [
    {
      "code": "usd",
      "name": "US Dollar",
      "symbol": "$"
    },
    {
      "code": "gbp", 
      "name": "British Pound",
      "symbol": "£"
    },
    {
      "code": "eur",
      "name": "Euro",
      "symbol": "€"
    }
  ]
}
```

## Payment Endpoints

### Get Invoice Payments

```http
GET /invoices/payments/list/
```

Retrieve a list of payments across all invoices.

**Query Parameters:**
- `expand` - Include additional data (`client` for client information)
- `client_id` - Filter payments by specific client
- `page_size` - Results per page
- `page` - Page number
- `timeframe_filter` - Time period filter
- `to` - End date (YYYY-MM-DD format)
- `transaction_date_to` - Filter by transaction end date

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/invoices/payments/list/?expand=client&page_size=50" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": [
    {
      "id": "ip_PAY001ABC123DEF456GHI789JKL012",
      "invoice_id": "in_INV001ABC123DEF456GHI789JKL012",
      "amount": 50000,
      "amount_formatted": "£500.00",
      "currency": "gbp",
      "payment_date": "2025-08-10T10:15:00.000000Z",
      "payment_method": "card",
      "status": "completed",
      "transaction_fee": 1500,
      "transaction_fee_formatted": "£15.00",
      "client": {
        "id": "cl_ABC123DEF456GHI789JKL012MNO345",
        "first_name": "John",
        "last_name": "Doe"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 50,
    "total": 117
  }
}
```

### Get Payment Details

```http
GET /invoices/{invoice_id}/payments/{payment_id}/
```

Retrieve detailed information about a specific payment.

**Path Parameters:**
- `invoice_id` - Invoice identifier
- `payment_id` - Payment identifier (e.g., `ip_PAY001ABC123DEF456GHI789JKL012`)

**Query Parameters:**
- `expand` - Include additional data (`client` for client information)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/invoices/in_INV001ABC123DEF456GHI789JKL012/payments/ip_PAY001ABC123DEF456GHI789JKL012/?expand=client" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "id": "ip_PAY001ABC123DEF456GHI789JKL012",
    "invoice_id": "in_INV001ABC123DEF456GHI789JKL012",
    "amount": 50000,
    "amount_formatted": "£500.00",
    "currency": "gbp",
    "payment_date": "2025-08-10T10:15:00.000000Z",
    "payment_method": "card",
    "payment_method_details": {
      "brand": "visa",
      "last_four": "4242",
      "exp_month": 12,
      "exp_year": 2026
    },
    "status": "completed",
    "transaction_fee": 1500,
    "transaction_fee_formatted": "£15.00",
    "processor_fee": 1450,
    "processor_fee_formatted": "£14.50",
    "net_amount": 48500,
    "net_amount_formatted": "£485.00",
    "client": {
      "id": "cl_ABC123DEF456GHI789JKL012MNO345",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    }
  }
}
```

### Get Disputed Payments Count

```http
GET /invoices/payments/disputed,needs-response/count
```

Get the count of payments that are disputed and require a response.

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/invoices/payments/disputed,needs-response/count" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "count": 3,
    "total_amount": 15000,
    "total_amount_formatted": "£150.00"
  }
}
```

## Invoice Summary by Client

### Get Client Invoice Currencies

```http
GET /invoices_summary/currencies
```

Get a list of currencies used in invoices for a specific client.

**Query Parameters:**
- `client_id` - Client identifier

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/invoices_summary/currencies?client_id=cl_ABC123DEF456GHI789JKL012MNO345" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": [
    {
      "currency": "gbp",
      "total_invoices": 5,
      "total_amount": 250000,
      "total_amount_formatted": "£2,500.00"
    },
    {
      "currency": "usd",
      "total_invoices": 2,
      "total_amount": 150000,
      "total_amount_formatted": "$1,500.00"
    }
  ]
}
```

### Get Client Invoice Totals by Currency

```http
GET /invoices_summary/totals/{currency}
```

Get invoice totals for a specific client in a particular currency.

**Path Parameters:**
- `currency` - Currency code (e.g., `gbp`, `usd`)

**Query Parameters:**
- `client_id` - Client identifier

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/invoices_summary/totals/gbp?client_id=cl_ABC123DEF456GHI789JKL012MNO345" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "client_id": "cl_ABC123DEF456GHI789JKL012MNO345",
    "currency": "gbp",
    "total_invoices": 5,
    "total_amount": 250000,
    "total_amount_formatted": "£2,500.00",
    "paid_amount": 200000,
    "paid_amount_formatted": "£2,000.00",
    "unpaid_amount": 50000,
    "unpaid_amount_formatted": "£500.00",
    "overdue_count": 1,
    "overdue_amount": 25000,
    "overdue_amount_formatted": "£250.00"
  }
}
```

## Invoice Object

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique invoice identifier |
| `invoice_number` | string | Human-readable invoice number |
| `amount` | integer | Total amount in smallest currency unit |
| `amount_formatted` | string | Formatted amount with currency symbol |
| `currency` | string | Currency code (usd, gbp, eur, etc.) |
| `status` | string | Invoice status (draft, sent, paid, overdue) |
| `due_date` | date | Invoice due date (YYYY-MM-DD) |
| `created_at` | datetime | Creation timestamp |
| `client` | object | Client information (when expanded) |
| `line_items` | array | Invoice line items (when expanded) |
| `payments` | array | Associated payments (when expanded) |

### Line Item Object

```json
{
  "id": "li_abc123",
  "name": "Wedding Photography Package",
  "description": "Full day wedding photography service",
  "quantity": 1,
  "amount": 45000,
  "amount_formatted": "£450.00",
  "taxable": true,
  "tax_rate": 20,
  "tax_amount": 9000,
  "tax_amount_formatted": "£90.00"
}
```

## Payment Object

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique payment identifier |
| `invoice_id` | string | Associated invoice ID |
| `amount` | integer | Payment amount in smallest currency unit |
| `amount_formatted` | string | Formatted amount with currency |
| `currency` | string | Currency code |
| `payment_date` | datetime | Payment timestamp |
| `payment_method` | string | Payment method (card, paypal, bank_transfer) |
| `status` | string | Payment status (completed, pending, failed, disputed) |
| `transaction_fee` | integer | Total transaction fee |
| `processor_fee` | integer | Payment processor fee |
| `net_amount` | integer | Net amount after fees |

### Payment Method Details

For card payments:
```json
{
  "payment_method_details": {
    "brand": "visa",
    "last_four": "4242",
    "exp_month": 12,
    "exp_year": 2026,
    "funding": "credit"
  }
}
```

For PayPal payments:
```json
{
  "payment_method_details": {
    "payer_email": "customer@example.com",
    "payer_id": "PAYERID123"
  }
}
```

## Payment Status Values

| Status | Description |
|--------|-------------|
| `completed` | Payment successfully processed |
| `pending` | Payment is being processed |
| `failed` | Payment failed to process |
| `disputed` | Payment has been disputed/chargebacked |
| `refunded` | Payment has been refunded |
| `partially_refunded` | Payment has been partially refunded |

## Error Handling

Common error responses:

### Invoice Not Found (404)
```json
{
  "error": {
    "code": "invoice_not_found",
    "message": "Invoice with ID in_INV001ABC123DEF456GHI789JKL012 not found"
  }
}
```

### Payment Not Found (404)
```json
{
  "error": {
    "code": "payment_not_found", 
    "message": "Payment with ID ip_PAY001ABC123DEF456GHI789JKL012 not found for invoice in_INV001ABC123DEF456GHI789JKL012"
  }
}
```

### Currency Not Supported (400)
```json
{
  "error": {
    "code": "invalid_currency",
    "message": "Currency code 'xyz' is not supported"
  }
}
```

## Best Practices

1. **Use pagination** - Process large payment lists in batches using `page_size` and `page`
2. **Filter by currency** - Always specify currency when generating reports
3. **Handle disputed payments** - Regularly check for disputed payments that need response
4. **Cache currency list** - Currency codes don't change frequently
5. **Use proper date formats** - Always use YYYY-MM-DD for date parameters
6. **Monitor payment status** - Check payment status before fulfilling services
7. **Track fees** - Account for transaction fees in your financial calculations

## Related Endpoints

- [Clients](/docs/studio-api/clients) - Client management
- Payment Reporting - Financial analytics
- [Coupons](/docs/studio-api/coupons) - Discount management
- Gift Cards - Gift card processing
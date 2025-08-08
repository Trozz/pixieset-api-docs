---
sidebar_position: 6
title: Conversations & Messaging
---

# Conversations & Messaging API

Manage client communication through conversations and messaging functionality in your photography business.

## Overview

The Conversations API enables you to:
- View and manage client conversations
- Send and receive messages with attachments
- Track unread message counts
- Filter conversations by client or status
- Handle file attachments in messages

## Message Workflow

1. **List conversations** to see all client communications
2. **Get conversation details** to view messages and participants
3. **Create messages** to send new messages to clients
4. **Upload attachments** using the attachment upload endpoint
5. **Monitor unread counts** to track pending communications

## Endpoints

### List Conversations

```http
GET /conversations/
```

**Query Parameters:**
- `client_id` - Filter conversations by specific client ID
- `page_size` - Number of results per page
- `page` - Page number for pagination
- `message` - Include message data (boolean)
- `message_status` - Filter by message status (e.g., `inbox`)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/conversations/?client_id=cl_ABC123&message=true&page_size=25" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": [
    {
      "id": "conv_ABC123XYZ456",
      "client_id": "cl_ABC123DEF456GHI789JKL012MNO345",
      "subject": "Wedding Photography Session",
      "last_message_at": "2025-08-07T10:30:00.000000Z",
      "unread_count": 2,
      "status": "active",
      "participants": [
        {
          "id": "cl_ABC123DEF456GHI789JKL012MNO345",
          "name": "John Doe",
          "email": "john@example.com",
          "type": "client"
        }
      ],
      "messages": [
        {
          "id": "msg_DEF789GHI012",
          "content": "Looking forward to our session!",
          "sent_at": "2025-08-07T10:30:00.000000Z",
          "sender_type": "client",
          "sender_id": "cl_ABC123DEF456GHI789JKL012MNO345",
          "attachments": []
        }
      ]
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 15,
    "last_page": 1
  }
}
```

### Get Conversation Details

```http
GET /conversations/{conversation_id}/
```

**Path Parameters:**
- `conversation_id` - Conversation identifier (e.g., `conv_ABC123XYZ456`)

**Query Parameters:**
- `messages` - Include messages in response (boolean, default: true)

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/conversations/conv_ABC123XYZ456/?messages=true" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "id": "conv_ABC123XYZ456",
    "client_id": "cl_ABC123DEF456GHI789JKL012MNO345",
    "subject": "Wedding Photography Session",
    "created_at": "2025-08-01T09:00:00.000000Z",
    "updated_at": "2025-08-07T10:30:00.000000Z",
    "status": "active",
    "unread_count": 2,
    "participants": [
      {
        "id": "cl_ABC123DEF456GHI789JKL012MNO345",
        "name": "John Doe",
        "email": "john@example.com",
        "type": "client",
        "avatar_color": 8
      },
      {
        "id": "photographer_123",
        "name": "Studio Photographer",
        "email": "studio@example.com",
        "type": "photographer"
      }
    ],
    "messages": [
      {
        "id": "msg_DEF789GHI012",
        "content": "Hi! I wanted to discuss the timeline for our wedding shoot.",
        "sent_at": "2025-08-07T09:00:00.000000Z",
        "sender_type": "client",
        "sender_id": "cl_ABC123DEF456GHI789JKL012MNO345",
        "read_at": null,
        "attachments": []
      },
      {
        "id": "msg_JKL345MNO678",
        "content": "Absolutely! I've attached our standard timeline template.",
        "sent_at": "2025-08-07T10:30:00.000000Z",
        "sender_type": "photographer",
        "sender_id": "photographer_123",
        "read_at": "2025-08-07T10:35:00.000000Z",
        "attachments": [
          {
            "id": "att_PQR901STU234",
            "filename": "wedding-timeline-template.pdf",
            "file_size": 245760,
            "content_type": "application/pdf",
            "url": "https://storage.pixieset.com/attachments/att_PQR901STU234.pdf"
          }
        ]
      }
    ]
  }
}
```

### Get Unread Count

```http
GET /conversations/unread/count
```

Returns the total number of unread messages across all conversations.

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/conversations/unread/count" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "unread_count": 5,
    "conversations_with_unread": 3
  }
}
```

### Create Conversation Message

```http
POST /conversation_messages
```

**Request Body:**
```json
{
  "conversation_id": "conv_ABC123XYZ456",
  "content": "Thank you for the timeline! This looks perfect.",
  "attachment_ids": ["att_PQR901STU234"]
}
```

**Example Request:**
```bash
curl -X POST "https://studio.pixieset.com/api/v1/conversation_messages" \
  -H "Cookie: session_cookie=your_session" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "conv_ABC123XYZ456",
    "content": "Thanks for the quick response!",
    "attachment_ids": []
  }'
```

**Response:**
```json
{
  "data": {
    "id": "msg_VWX567YZA890",
    "conversation_id": "conv_ABC123XYZ456",
    "content": "Thanks for the quick response!",
    "sent_at": "2025-08-07T11:00:00.000000Z",
    "sender_type": "photographer",
    "sender_id": "photographer_123",
    "read_at": null,
    "attachments": []
  }
}
```

### Get Upload URL for Attachments

```http
GET /conversation_message_attachments/upload_url
```

**Query Parameters:**
- `filename` - Name of the file to upload
- `content_type` - MIME type of the file
- `file_size` - Size of the file in bytes

**Example Request:**
```bash
curl -X GET "https://studio.pixieset.com/api/v1/conversation_message_attachments/upload_url?filename=contract.pdf&content_type=application/pdf&file_size=102400" \
  -H "Cookie: session_cookie=your_session"
```

**Response:**
```json
{
  "data": {
    "upload_url": "https://storage.pixieset.com/upload/signed-url-here",
    "attachment_id": "att_BCD012EFG345",
    "upload_fields": {
      "key": "attachments/att_BCD012EFG345",
      "Content-Type": "application/pdf",
      "policy": "base64-encoded-policy",
      "x-amz-algorithm": "AWS4-HMAC-SHA256",
      "x-amz-credential": "credentials-here",
      "x-amz-date": "20250807T110000Z",
      "x-amz-signature": "signature-here"
    },
    "method": "POST"
  }
}
```

## Data Models

### Conversation Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique conversation identifier |
| `client_id` | string | Associated client ID |
| `subject` | string | Conversation subject line |
| `created_at` | datetime | Creation timestamp |
| `updated_at` | datetime | Last update timestamp |
| `last_message_at` | datetime | Timestamp of most recent message |
| `status` | string | Conversation status (active, archived) |
| `unread_count` | integer | Number of unread messages |
| `participants` | array | Array of participant objects |
| `messages` | array | Array of message objects (when included) |

### Message Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique message identifier |
| `conversation_id` | string | Parent conversation ID |
| `content` | string | Message text content |
| `sent_at` | datetime | Message sent timestamp |
| `read_at` | datetime | Message read timestamp (null if unread) |
| `sender_type` | string | Type of sender (client, photographer, system) |
| `sender_id` | string | ID of the sender |
| `attachments` | array | Array of attachment objects |

### Participant Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Participant ID |
| `name` | string | Display name |
| `email` | string | Email address |
| `type` | string | Participant type (client, photographer) |
| `avatar_color` | integer | Avatar color index (for clients) |

### Attachment Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique attachment identifier |
| `filename` | string | Original filename |
| `file_size` | integer | File size in bytes |
| `content_type` | string | MIME type |
| `url` | string | Download URL |

## ID Formats

- **Conversation ID**: `conv_` followed by alphanumeric characters
- **Message ID**: `msg_` followed by alphanumeric characters  
- **Attachment ID**: `att_` followed by alphanumeric characters

## Filtering & Pagination

### Client Filtering

Filter conversations by specific client:
```bash
GET /conversations/?client_id=cl_ABC123DEF456GHI789JKL012MNO345
```

### Message Status Filtering

Filter by message status (useful for inbox organization):
```bash
GET /conversations/?message_status=inbox&page_size=50
```

### Including Message Data

Include full message content in conversation lists:
```bash
GET /conversations/?message=true&page_size=10
```

## Attachment Handling

### Upload Workflow

1. **Get upload URL** with file details
2. **Upload file** to the provided signed URL using POST with form fields
3. **Use attachment ID** when creating messages

**Example Upload Process:**

```bash
# 1. Get upload URL
curl -X GET "https://studio.pixieset.com/api/v1/conversation_message_attachments/upload_url?filename=photo.jpg&content_type=image/jpeg&file_size=1048576"

# 2. Upload file using returned URL and fields
curl -X POST "https://storage.pixieset.com/upload/signed-url" \
  -F "key=attachments/att_BCD012EFG345" \
  -F "Content-Type=image/jpeg" \
  -F "policy=base64-policy" \
  -F "x-amz-algorithm=AWS4-HMAC-SHA256" \
  -F "x-amz-credential=credentials" \
  -F "x-amz-date=20250807T110000Z" \
  -F "x-amz-signature=signature" \
  -F "file=@/path/to/photo.jpg"

# 3. Create message with attachment
curl -X POST "https://studio.pixieset.com/api/v1/conversation_messages" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "conv_ABC123XYZ456",
    "content": "Here are the sample photos!",
    "attachment_ids": ["att_BCD012EFG345"]
  }'
```

### Supported File Types

Common attachment types include:
- **Documents**: PDF, DOC, DOCX
- **Images**: JPG, PNG, GIF, WEBP
- **Archives**: ZIP, RAR
- **Text**: TXT, CSV

File size limits and type restrictions may apply based on your plan.

## Best Practices

### 1. Efficient Message Loading

Load conversations without messages first, then fetch message details as needed:

```bash
# List conversations (lightweight)
GET /conversations/?page_size=25

# Get specific conversation with messages
GET /conversations/conv_ABC123XYZ456/?messages=true
```

### 2. Unread Count Monitoring

Check unread counts regularly to maintain responsiveness:

```bash
GET /conversations/unread/count
```

### 3. Client-Specific Views

Filter conversations by client for focused views:

```bash
GET /conversations/?client_id=cl_ABC123&message_status=inbox
```

### 4. Attachment Size Management

Check file sizes before upload and compress when possible:

```javascript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
if (file.size > MAX_FILE_SIZE) {
  // Handle oversized file
}
```

### 5. Message Threading

Keep related messages in the same conversation to maintain context and improve organization.

## Error Handling

### Common Error Responses

**404 Not Found** - Conversation or message doesn't exist:
```json
{
  "error": "Conversation not found",
  "code": "CONVERSATION_NOT_FOUND"
}
```

**403 Forbidden** - No access to conversation:
```json
{
  "error": "Access denied to conversation",
  "code": "ACCESS_DENIED"
}
```

**413 Payload Too Large** - Attachment too large:
```json
{
  "error": "File size exceeds maximum allowed",
  "code": "FILE_TOO_LARGE",
  "max_size": 10485760
}
```

## Related Endpoints

- [Clients](/docs/studio-api/clients) - Client management
- [Sessions](/docs/studio-api/sessions) - Session booking communications
- [Contracts](/docs/studio-api/contracts) - Document-related messaging
- [Invoices](/docs/studio-api/invoices) - Billing communications

## Integration Examples

### Client Communication Dashboard

```javascript
// Get unread count for badge
const unreadData = await fetch('/api/v1/conversations/unread/count');
const { unread_count } = await unreadData.json();

// Get recent conversations with messages
const conversations = await fetch('/api/v1/conversations/?message=true&page_size=10');
const convData = await conversations.json();

// Display conversations with unread indicators
convData.data.forEach(conv => {
  displayConversation(conv, conv.unread_count > 0);
});
```

### Message Notification System

```javascript
// Poll for new messages
setInterval(async () => {
  const unreadResponse = await fetch('/api/v1/conversations/unread/count');
  const { unread_count } = await unreadResponse.json();
  
  if (unread_count > previousCount) {
    showNotification(`${unread_count - previousCount} new messages`);
    refreshConversationList();
  }
  
  previousCount = unread_count;
}, 30000); // Check every 30 seconds
```
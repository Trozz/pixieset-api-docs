---
sidebar_position: 1
title: Quick Start
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start Guide

Get up and running with the Pixieset API in minutes. This guide will walk you through authentication, making your first API call, and implementing common workflows.

:::warning Important Notice
This is **unofficial, reverse-engineered documentation**. The Pixieset API is not publicly documented and may change without notice. Use at your own risk.
:::

## Prerequisites

Before you begin, you'll need:
- A Pixieset Studio or Gallery account
- Basic knowledge of HTTP/REST APIs
- A tool for making HTTP requests (curl, Postman, or a programming language)

## Step 1: Authentication

The Pixieset API uses session-based authentication with cookies. You'll need to log in through the web interface first.

### Get Your Session Cookie

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
// First, log in via the Pixieset web interface
// Then make authenticated requests with credentials included

const response = await fetch('https://studio.pixieset.com/api/v1/clients/', {
  credentials: 'include', // This includes cookies
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

const data = await response.json();
console.log('Clients:', data);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Create a session to persist cookies
session = requests.Session()

# You'll need to log in first through the web interface
# and copy your session cookie

headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cookie': 'your_session_cookie_here'
}

response = session.get(
    'https://studio.pixieset.com/api/v1/clients/',
    headers=headers
)

clients = response.json()
print(f"Found {len(clients['data'])} clients")
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
// Initialize cURL session
$ch = curl_init();

// Set the API endpoint
curl_setopt($ch, CURLOPT_URL, "https://studio.pixieset.com/api/v1/clients/");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Include session cookie (obtain from browser after login)
$headers = [
    'Content-Type: application/json',
    'X-Requested-With: XMLHttpRequest',
    'Cookie: your_session_cookie_here'
];
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Execute request
$response = curl_exec($ch);
$clients = json_decode($response, true);

// Check for errors
if (curl_errno($ch)) {
    echo 'Error: ' . curl_error($ch);
} else {
    echo "Found " . count($clients['data']) . " clients\n";
}

curl_close($ch);
?>
```

</TabItem>
<TabItem value="curl" label="curl">

```bash
# Get your session cookie from browser DevTools after logging in
# Network tab -> Any API request -> Request Headers -> Cookie

curl -X GET "https://studio.pixieset.com/api/v1/clients/" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  -H "Cookie: your_session_cookie_here"
```

</TabItem>
</Tabs>

## Step 2: Your First API Call

Let's fetch your client list - one of the most common operations.

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
async function getClients() {
  try {
    const response = await fetch('https://studio.pixieset.com/api/v1/clients/', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Process the clients
    data.data.forEach(client => {
      console.log(`${client.first_name} ${client.last_name} - ${client.email}`);
    });
    
    // Check pagination
    console.log(`Page ${data.meta.current_page} of ${data.meta.last_page}`);
    
    return data;
  } catch (error) {
    console.error('Error fetching clients:', error);
  }
}

// Call the function
getClients();
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
import json

def get_clients(session_cookie):
    """Fetch all clients from Pixieset Studio API"""
    
    url = "https://studio.pixieset.com/api/v1/clients/"
    headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': session_cookie
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for bad status codes
        
        data = response.json()
        
        # Process the clients
        for client in data['data']:
            print(f"{client['first_name']} {client['last_name']} - {client['email']}")
        
        # Show pagination info
        meta = data['meta']
        print(f"\nPage {meta['current_page']} of {meta['last_page']}")
        print(f"Total clients: {meta['total']}")
        
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching clients: {e}")
        return None

# Usage
session_cookie = "your_session_cookie_here"
clients = get_clients(session_cookie)
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
function getClients($sessionCookie) {
    $url = "https://studio.pixieset.com/api/v1/clients/";
    
    $options = [
        'http' => [
            'header' => [
                "Content-Type: application/json",
                "X-Requested-With: XMLHttpRequest",
                "Cookie: " . $sessionCookie
            ],
            'method' => 'GET'
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === FALSE) {
        die('Error fetching clients');
    }
    
    $data = json_decode($response, true);
    
    // Process the clients
    foreach ($data['data'] as $client) {
        echo "{$client['first_name']} {$client['last_name']} - {$client['email']}\n";
    }
    
    // Show pagination info
    $meta = $data['meta'];
    echo "\nPage {$meta['current_page']} of {$meta['last_page']}\n";
    echo "Total clients: {$meta['total']}\n";
    
    return $data;
}

// Usage
$sessionCookie = "your_session_cookie_here";
$clients = getClients($sessionCookie);
?>
```

</TabItem>
</Tabs>

## Step 3: Common Workflows

### Create a New Client

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
async function createClient(clientData) {
  const response = await fetch('https://studio.pixieset.com/api/v1/clients/', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({
      first_name: clientData.firstName,
      last_name: clientData.lastName,
      email: clientData.email,
      phone: clientData.phone
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create client');
  }

  const newClient = await response.json();
  console.log('Created client:', newClient.data.id);
  return newClient.data;
}

// Usage
createClient({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-123-4567'
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
def create_client(session_cookie, client_data):
    """Create a new client in Pixieset"""
    
    url = "https://studio.pixieset.com/api/v1/clients/"
    headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': session_cookie
    }
    
    payload = {
        'first_name': client_data['first_name'],
        'last_name': client_data['last_name'],
        'email': client_data['email'],
        'phone': client_data.get('phone', '')
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 201:
        new_client = response.json()
        print(f"Created client: {new_client['data']['id']}")
        return new_client['data']
    else:
        error = response.json()
        print(f"Error: {error.get('message', 'Failed to create client')}")
        return None

# Usage
new_client = create_client(session_cookie, {
    'first_name': 'John',
    'last_name': 'Doe',
    'email': 'john.doe@example.com',
    'phone': '+1-555-123-4567'
})
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
function createClient($sessionCookie, $clientData) {
    $url = "https://studio.pixieset.com/api/v1/clients/";
    
    $data = json_encode([
        'first_name' => $clientData['first_name'],
        'last_name' => $clientData['last_name'],
        'email' => $clientData['email'],
        'phone' => $clientData['phone'] ?? ''
    ]);
    
    $options = [
        'http' => [
            'header' => [
                "Content-Type: application/json",
                "X-Requested-With: XMLHttpRequest",
                "Cookie: " . $sessionCookie
            ],
            'method' => 'POST',
            'content' => $data
        ]
    ];
    
    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === FALSE) {
        die('Error creating client');
    }
    
    $result = json_decode($response, true);
    echo "Created client: " . $result['data']['id'] . "\n";
    
    return $result['data'];
}

// Usage
$newClient = createClient($sessionCookie, [
    'first_name' => 'John',
    'last_name' => 'Doe',
    'email' => 'john.doe@example.com',
    'phone' => '+1-555-123-4567'
]);
?>
```

</TabItem>
</Tabs>

### Fetch Invoices with Pagination

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
async function getAllInvoices() {
  let allInvoices = [];
  let currentPage = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(
      `https://studio.pixieset.com/api/v1/invoices/?page=${currentPage}&per_page=50`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );
    
    const data = await response.json();
    allInvoices = allInvoices.concat(data.data);
    
    // Check if there are more pages
    hasMore = currentPage < data.meta.last_page;
    currentPage++;
    
    console.log(`Fetched page ${currentPage - 1} of ${data.meta.last_page}`);
  }
  
  console.log(`Total invoices: ${allInvoices.length}`);
  return allInvoices;
}

// Usage
getAllInvoices().then(invoices => {
  // Process all invoices
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  console.log(`Total invoiced: ${totalAmount / 100}`); // Convert from cents
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
def get_all_invoices(session_cookie):
    """Fetch all invoices with pagination"""
    
    all_invoices = []
    current_page = 1
    has_more = True
    
    headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Cookie': session_cookie
    }
    
    while has_more:
        url = f"https://studio.pixieset.com/api/v1/invoices/?page={current_page}&per_page=50"
        response = requests.get(url, headers=headers)
        data = response.json()
        
        all_invoices.extend(data['data'])
        
        # Check for more pages
        has_more = current_page < data['meta']['last_page']
        print(f"Fetched page {current_page} of {data['meta']['last_page']}")
        current_page += 1
    
    print(f"Total invoices: {len(all_invoices)}")
    
    # Calculate total amount
    total_amount = sum(inv['amount'] for inv in all_invoices)
    print(f"Total invoiced: ${total_amount / 100:.2f}")  # Convert from cents
    
    return all_invoices

# Usage
invoices = get_all_invoices(session_cookie)
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
function getAllInvoices($sessionCookie) {
    $allInvoices = [];
    $currentPage = 1;
    $hasMore = true;
    
    $headers = [
        "Content-Type: application/json",
        "X-Requested-With: XMLHttpRequest",
        "Cookie: " . $sessionCookie
    ];
    
    while ($hasMore) {
        $url = "https://studio.pixieset.com/api/v1/invoices/?page={$currentPage}&per_page=50";
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        
        $response = curl_exec($ch);
        $data = json_decode($response, true);
        curl_close($ch);
        
        $allInvoices = array_merge($allInvoices, $data['data']);
        
        // Check for more pages
        $hasMore = $currentPage < $data['meta']['last_page'];
        echo "Fetched page {$currentPage} of {$data['meta']['last_page']}\n";
        $currentPage++;
    }
    
    echo "Total invoices: " . count($allInvoices) . "\n";
    
    // Calculate total amount
    $totalAmount = array_sum(array_column($allInvoices, 'amount'));
    echo "Total invoiced: $" . number_format($totalAmount / 100, 2) . "\n";
    
    return $allInvoices;
}

// Usage
$invoices = getAllInvoices($sessionCookie);
?>
```

</TabItem>
</Tabs>

## Step 4: Error Handling

Always implement proper error handling in your integration:

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
class PixiesetAPI {
  constructor() {
    this.baseUrl = 'https://studio.pixieset.com/api/v1';
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers
        }
      });
      
      // Handle different status codes
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      
      if (response.status === 404) {
        throw new Error('Resource not found');
      }
      
      if (response.status === 422) {
        const error = await response.json();
        throw new Error(`Validation failed: ${JSON.stringify(error.details)}`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error.message);
      throw error;
    }
  }
  
  // Example methods using the error-handled request
  async getClients() {
    return this.request('/clients/');
  }
  
  async createClient(data) {
    return this.request('/clients/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

// Usage
const api = new PixiesetAPI();

api.getClients()
  .then(clients => console.log('Clients:', clients))
  .catch(error => console.error('Failed to get clients:', error));
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from typing import Optional, Dict, Any

class PixiesetAPI:
    def __init__(self, session_cookie: str):
        self.base_url = "https://studio.pixieset.com/api/v1"
        self.session_cookie = session_cookie
        self.headers = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie': session_cookie
        }
    
    def request(self, endpoint: str, method: str = 'GET', 
                data: Optional[Dict] = None) -> Dict[str, Any]:
        """Make a request with error handling"""
        
        url = f"{self.base_url}{endpoint}"
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=self.headers)
            elif method == 'POST':
                response = requests.post(url, headers=self.headers, json=data)
            elif method == 'PUT':
                response = requests.put(url, headers=self.headers, json=data)
            elif method == 'DELETE':
                response = requests.delete(url, headers=self.headers)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            # Handle different status codes
            if response.status_code == 401:
                raise Exception("Authentication required. Please log in.")
            
            if response.status_code == 404:
                raise Exception("Resource not found")
            
            if response.status_code == 422:
                error = response.json()
                raise Exception(f"Validation failed: {error.get('details', {})}")
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"API Error for {endpoint}: {e}")
            raise
    
    def get_clients(self):
        """Get all clients"""
        return self.request('/clients/')
    
    def create_client(self, client_data: Dict):
        """Create a new client"""
        return self.request('/clients/', method='POST', data=client_data)
    
    def get_invoices(self, page: int = 1, per_page: int = 50):
        """Get invoices with pagination"""
        return self.request(f'/invoices/?page={page}&per_page={per_page}')

# Usage
api = PixiesetAPI(session_cookie="your_session_cookie")

try:
    clients = api.get_clients()
    print(f"Found {len(clients['data'])} clients")
except Exception as e:
    print(f"Error: {e}")
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
class PixiesetAPI {
    private $baseUrl = 'https://studio.pixieset.com/api/v1';
    private $sessionCookie;
    
    public function __construct($sessionCookie) {
        $this->sessionCookie = $sessionCookie;
    }
    
    private function request($endpoint, $method = 'GET', $data = null) {
        $url = $this->baseUrl . $endpoint;
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        
        $headers = [
            'Content-Type: application/json',
            'X-Requested-With: XMLHttpRequest',
            'Cookie: ' . $this->sessionCookie
        ];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        
        if ($data !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_errno($ch)) {
            throw new Exception('cURL Error: ' . curl_error($ch));
        }
        
        curl_close($ch);
        
        // Handle different status codes
        switch ($httpCode) {
            case 401:
                throw new Exception('Authentication required. Please log in.');
            case 404:
                throw new Exception('Resource not found');
            case 422:
                $error = json_decode($response, true);
                throw new Exception('Validation failed: ' . json_encode($error['details'] ?? []));
            default:
                if ($httpCode >= 400) {
                    throw new Exception("HTTP Error $httpCode");
                }
        }
        
        return json_decode($response, true);
    }
    
    public function getClients() {
        return $this->request('/clients/');
    }
    
    public function createClient($clientData) {
        return $this->request('/clients/', 'POST', $clientData);
    }
    
    public function getInvoices($page = 1, $perPage = 50) {
        return $this->request("/invoices/?page=$page&per_page=$perPage");
    }
}

// Usage
$api = new PixiesetAPI('your_session_cookie');

try {
    $clients = $api->getClients();
    echo "Found " . count($clients['data']) . " clients\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
```

</TabItem>
</Tabs>

## Step 5: Working with IDs

Pixieset uses specific ID formats for different resources. Always validate IDs:

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
// ID Validation Helper
const validateId = (id, type) => {
  const patterns = {
    client: /^cl_[A-Za-z0-9]{30}$/,
    invoice: /^in_[A-Za-z0-9]{30}$/,
    payment: /^ip_[A-Za-z0-9]{30}$/,
    contract: /^co_[A-Za-z0-9]{30}$/
  };
  
  const pattern = patterns[type];
  if (!pattern) {
    throw new Error(`Unknown resource type: ${type}`);
  }
  
  if (!pattern.test(id)) {
    throw new Error(`Invalid ${type} ID format: ${id}`);
  }
  
  return true;
};

// Usage
const clientId = 'cl_ABC123DEF456GHI789JKL012MNO345';

try {
  validateId(clientId, 'client');
  // Proceed with API call
  console.log('Valid client ID');
} catch (error) {
  console.error('Invalid ID:', error.message);
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import re

def validate_id(resource_id: str, resource_type: str) -> bool:
    """Validate Pixieset resource ID format"""
    
    patterns = {
        'client': r'^cl_[A-Za-z0-9]{30}$',
        'invoice': r'^in_[A-Za-z0-9]{30}$',
        'payment': r'^ip_[A-Za-z0-9]{30}$',
        'contract': r'^co_[A-Za-z0-9]{30}$'
    }
    
    pattern = patterns.get(resource_type)
    if not pattern:
        raise ValueError(f"Unknown resource type: {resource_type}")
    
    if not re.match(pattern, resource_id):
        raise ValueError(f"Invalid {resource_type} ID format: {resource_id}")
    
    return True

# Usage
client_id = 'cl_ABC123DEF456GHI789JKL012MNO345'

try:
    validate_id(client_id, 'client')
    print("Valid client ID")
    # Proceed with API call
except ValueError as e:
    print(f"Invalid ID: {e}")
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
function validateId($id, $type) {
    $patterns = [
        'client' => '/^cl_[A-Za-z0-9]{30}$/',
        'invoice' => '/^in_[A-Za-z0-9]{30}$/',
        'payment' => '/^ip_[A-Za-z0-9]{30}$/',
        'contract' => '/^co_[A-Za-z0-9]{30}$/'
    ];
    
    if (!isset($patterns[$type])) {
        throw new Exception("Unknown resource type: $type");
    }
    
    if (!preg_match($patterns[$type], $id)) {
        throw new Exception("Invalid $type ID format: $id");
    }
    
    return true;
}

// Usage
$clientId = 'cl_ABC123DEF456GHI789JKL012MNO345';

try {
    validateId($clientId, 'client');
    echo "Valid client ID\n";
    // Proceed with API call
} catch (Exception $e) {
    echo "Invalid ID: " . $e->getMessage() . "\n";
}
?>
```

</TabItem>
</Tabs>

## Complete Example: Client Management System

Here's a complete example that ties everything together:

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
class ClientManager {
  constructor() {
    this.baseUrl = 'https://studio.pixieset.com/api/v1';
  }
  
  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  }
  
  async searchClients(email) {
    const clients = await this.request('/clients/');
    return clients.data.filter(c => 
      c.email.toLowerCase().includes(email.toLowerCase())
    );
  }
  
  async getClientInvoices(clientId) {
    // Validate client ID
    if (!/^cl_[A-Za-z0-9]{30}$/.test(clientId)) {
      throw new Error('Invalid client ID');
    }
    
    const invoices = await this.request(
      `/invoices/?client_id=${clientId}&expand=client`
    );
    
    return invoices.data;
  }
  
  async createInvoice(clientId, items) {
    const invoice = await this.request('/invoices/', {
      method: 'POST',
      body: JSON.stringify({
        client_id: clientId,
        due_date: this.getFutureDate(30), // 30 days from now
        line_items: items,
        send_email: true
      })
    });
    
    return invoice.data;
  }
  
  getFutureDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }
}

// Usage Example
async function main() {
  const manager = new ClientManager();
  
  try {
    // Search for a client
    const clients = await manager.searchClients('john@example.com');
    
    if (clients.length === 0) {
      console.log('No clients found');
      return;
    }
    
    const client = clients[0];
    console.log(`Found client: ${client.first_name} ${client.last_name}`);
    
    // Get client's invoices
    const invoices = await manager.getClientInvoices(client.id);
    console.log(`Client has ${invoices.length} invoices`);
    
    // Create a new invoice
    const newInvoice = await manager.createInvoice(client.id, [
      {
        name: 'Wedding Photography Package',
        amount: 250000, // $2,500.00 in cents
        quantity: 1
      }
    ]);
    
    console.log(`Created invoice: ${newInvoice.invoice_number}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

</TabItem>
<TabItem value="python" label="Python">

```python
from datetime import datetime, timedelta
import re
from typing import List, Dict, Any

class ClientManager:
    def __init__(self, session_cookie: str):
        self.base_url = "https://studio.pixieset.com/api/v1"
        self.headers = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie': session_cookie
        }
    
    def request(self, endpoint: str, method: str = 'GET', data: Dict = None):
        """Make API request with error handling"""
        import requests
        
        url = f"{self.base_url}{endpoint}"
        
        if method == 'GET':
            response = requests.get(url, headers=self.headers)
        elif method == 'POST':
            response = requests.post(url, headers=self.headers, json=data)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        response.raise_for_status()
        return response.json()
    
    def search_clients(self, email: str) -> List[Dict]:
        """Search for clients by email"""
        clients = self.request('/clients/')
        return [
            c for c in clients['data'] 
            if email.lower() in c['email'].lower()
        ]
    
    def get_client_invoices(self, client_id: str) -> List[Dict]:
        """Get all invoices for a client"""
        # Validate client ID
        if not re.match(r'^cl_[A-Za-z0-9]{30}$', client_id):
            raise ValueError('Invalid client ID')
        
        invoices = self.request(
            f'/invoices/?client_id={client_id}&expand=client'
        )
        return invoices['data']
    
    def create_invoice(self, client_id: str, items: List[Dict]) -> Dict:
        """Create a new invoice for a client"""
        due_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
        
        invoice_data = {
            'client_id': client_id,
            'due_date': due_date,
            'line_items': items,
            'send_email': True
        }
        
        invoice = self.request('/invoices/', method='POST', data=invoice_data)
        return invoice['data']

# Usage Example
def main():
    session_cookie = "your_session_cookie_here"
    manager = ClientManager(session_cookie)
    
    try:
        # Search for a client
        clients = manager.search_clients('john@example.com')
        
        if not clients:
            print('No clients found')
            return
        
        client = clients[0]
        print(f"Found client: {client['first_name']} {client['last_name']}")
        
        # Get client's invoices
        invoices = manager.get_client_invoices(client['id'])
        print(f"Client has {len(invoices)} invoices")
        
        # Create a new invoice
        new_invoice = manager.create_invoice(client['id'], [
            {
                'name': 'Wedding Photography Package',
                'amount': 250000,  # $2,500.00 in cents
                'quantity': 1
            }
        ])
        
        print(f"Created invoice: {new_invoice['invoice_number']}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
class ClientManager {
    private $baseUrl = 'https://studio.pixieset.com/api/v1';
    private $sessionCookie;
    
    public function __construct($sessionCookie) {
        $this->sessionCookie = $sessionCookie;
    }
    
    private function request($endpoint, $method = 'GET', $data = null) {
        $url = $this->baseUrl . $endpoint;
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        
        $headers = [
            'Content-Type: application/json',
            'X-Requested-With: XMLHttpRequest',
            'Cookie: ' . $this->sessionCookie
        ];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        
        if ($data !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode >= 400) {
            throw new Exception("HTTP Error $httpCode");
        }
        
        return json_decode($response, true);
    }
    
    public function searchClients($email) {
        $clients = $this->request('/clients/');
        
        return array_filter($clients['data'], function($client) use ($email) {
            return stripos($client['email'], $email) !== false;
        });
    }
    
    public function getClientInvoices($clientId) {
        // Validate client ID
        if (!preg_match('/^cl_[A-Za-z0-9]{30}$/', $clientId)) {
            throw new Exception('Invalid client ID');
        }
        
        $invoices = $this->request(
            "/invoices/?client_id=$clientId&expand=client"
        );
        
        return $invoices['data'];
    }
    
    public function createInvoice($clientId, $items) {
        $dueDate = date('Y-m-d', strtotime('+30 days'));
        
        $invoiceData = [
            'client_id' => $clientId,
            'due_date' => $dueDate,
            'line_items' => $items,
            'send_email' => true
        ];
        
        $invoice = $this->request('/invoices/', 'POST', $invoiceData);
        return $invoice['data'];
    }
}

// Usage Example
function main() {
    $sessionCookie = 'your_session_cookie_here';
    $manager = new ClientManager($sessionCookie);
    
    try {
        // Search for a client
        $clients = $manager->searchClients('john@example.com');
        
        if (empty($clients)) {
            echo "No clients found\n";
            return;
        }
        
        $client = array_values($clients)[0];
        echo "Found client: {$client['first_name']} {$client['last_name']}\n";
        
        // Get client's invoices
        $invoices = $manager->getClientInvoices($client['id']);
        echo "Client has " . count($invoices) . " invoices\n";
        
        // Create a new invoice
        $newInvoice = $manager->createInvoice($client['id'], [
            [
                'name' => 'Wedding Photography Package',
                'amount' => 250000, // $2,500.00 in cents
                'quantity' => 1
            ]
        ]);
        
        echo "Created invoice: {$newInvoice['invoice_number']}\n";
        
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}

main();
?>
```

</TabItem>
</Tabs>

## Next Steps

Now that you've got the basics down, explore these areas:

### Essential Reading
- 📖 [Authentication Guide](/docs/authentication) - Deep dive into session management
- 🔍 [Error Handling](/docs/error-handling) - Comprehensive error recovery strategies
- 📄 [Pagination](/docs/pagination) - Handle large datasets efficiently
- ✅ [Best Practices](/docs/best-practices) - Production-ready integration tips

### API References
- 💼 [Studio API Overview](/docs/studio-api/overview) - Business management endpoints
- 🖼️ [Gallery API Overview](/docs/gallery-api/overview) - Photo delivery endpoints
- 🆔 [ID Format Reference](/docs/id-formats) - Understanding resource identifiers

### Common Integration Points
- [Client Management](/docs/studio-api/clients)
- [Invoice Processing](/docs/studio-api/invoices)
- [Session Scheduling](/docs/studio-api/sessions)
- [Collection Management](/docs/gallery-api/collections)

## Need Help?

Remember that this is unofficial documentation. The Pixieset API:
- May change without notice
- Has no official support
- Should be used with proper error handling

Always test thoroughly in a development environment before deploying to production.

## Code Resources

### Download Examples

We provide example code in multiple languages:

- **[JavaScript/Node.js Examples](https://github.com/trozz/pixieset-api-examples/tree/main/javascript)**
- **[Python Examples](https://github.com/trozz/pixieset-api-examples/tree/main/python)**
- **[PHP Examples](https://github.com/trozz/pixieset-api-examples/tree/main/php)**

### Community Resources

Join the community to share experiences and get help:
- Report issues or contribute to [documentation on GitHub](https://github.com/trozz/pixieset-api-docs)
- Share your integration examples

---

Happy coding! 🚀
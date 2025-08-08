---
sidebar_position: 2
title: Authentication
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Authentication

Both the Studio API and Gallery API use session-based authentication with cookies.

## Overview

Pixieset APIs require authentication through the web application login flow. Once authenticated, session cookies are used to authorize API requests.

## Authentication Flow

### 1. Web Login
First, authenticate through the Pixieset web application:

**Studio Login:**
```
https://studio.pixieset.com/login
```

**Gallery Login:**
```
https://galleries.pixieset.com/login
```

### 2. Session Cookies
After successful login, the following cookies are set:
- Session identifier cookie
- Authentication token
- CSRF token (for write operations)

### 3. Include Cookies in API Requests
Include the session cookies in all API requests:

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://studio.pixieset.com/api/v1/clients/" \
  -H "Cookie: session_cookie=your_session_value" \
  -H "X-CSRF-Token: your_csrf_token"
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
const response = await fetch('https://studio.pixieset.com/api/v1/clients/', {
  headers: {
    'Cookie': 'session_cookie=your_session_value',
    'X-CSRF-Token': 'your_csrf_token'
  }
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://studio.pixieset.com/api/v1/clients/',
    headers={
        'Cookie': 'session_cookie=your_session_value',
        'X-CSRF-Token': 'your_csrf_token'
    }
)
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://studio.pixieset.com/api/v1/clients/');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Cookie: session_cookie=your_session_value',
    'X-CSRF-Token: your_csrf_token'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="ruby" label="Ruby">

```ruby
require 'net/http'
require 'uri'

uri = URI('https://studio.pixieset.com/api/v1/clients/')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Get.new(uri)
request['Cookie'] = 'session_cookie=your_session_value'
request['X-CSRF-Token'] = 'your_csrf_token'

response = http.request(request)
```

</TabItem>
</Tabs>

## Session Management

### Session Expiration
- Sessions typically expire after a period of inactivity
- Monitor for `401 Unauthorized` responses
- Re-authenticate when session expires

### Maintaining Sessions
To keep sessions active:
- Make periodic API calls
- Implement session refresh logic
- Handle re-authentication gracefully

## Security Best Practices

### Cookie Storage
- Store cookies securely
- Never expose cookies in client-side code
- Use HTTPS for all requests

### CSRF Protection
For POST, PUT, DELETE operations:
- Include CSRF token in headers
- Token is provided during authentication
- Refresh token if expired

### Rate Limiting
- Respect rate limits to avoid throttling
- Implement exponential backoff for retries
- Cache responses when appropriate

## Example Implementation

<Tabs>
<TabItem value="javascript" label="JavaScript" default>

```javascript
const axios = require('axios');

// Store cookies from login
let sessionCookies = '';
let csrfToken = '';

// Configure axios with cookies
const apiClient = axios.create({
  baseURL: 'https://studio.pixieset.com/api/v1',
  headers: {
    'Cookie': sessionCookies,
    'X-CSRF-Token': csrfToken
  }
});

// Make authenticated request
async function getClients() {
  try {
    const response = await apiClient.get('/clients/');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Handle re-authentication
      await reauthenticate();
      return getClients();
    }
    throw error;
  }
}

// Re-authentication function
async function reauthenticate() {
  // Implementation depends on your login flow
  console.log('Re-authenticating...');
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests
from requests.exceptions import HTTPError

class PixiesetClient:
    def __init__(self, base_url='https://studio.pixieset.com'):
        self.base_url = base_url
        self.session = requests.Session()
        
    def login(self, email, password):
        """Login and store cookies"""
        login_response = self.session.post(
            f'{self.base_url}/login',
            data={'email': email, 'password': password}
        )
        login_response.raise_for_status()
        return login_response
    
    def get_clients(self):
        """Get clients with automatic re-authentication"""
        try:
            response = self.session.get(f'{self.base_url}/api/v1/clients/')
            response.raise_for_status()
            return response.json()
        except HTTPError as e:
            if e.response.status_code == 401:
                # Handle re-authentication
                self.reauthenticate()
                return self.get_clients()
            raise
    
    def reauthenticate(self):
        """Re-authentication logic"""
        print("Re-authenticating...")
        # Implementation depends on your login flow

# Usage
client = PixiesetClient()
# client.login('your_email', 'your_password')
clients = client.get_clients()
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
class PixiesetClient {
    private $baseUrl;
    private $cookieJar;
    private $csrfToken;
    
    public function __construct($baseUrl = 'https://studio.pixieset.com') {
        $this->baseUrl = $baseUrl;
        $this->cookieJar = tempnam(sys_get_temp_dir(), 'pixieset_cookies');
    }
    
    public function login($email, $password) {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->baseUrl . '/login',
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query([
                'email' => $email,
                'password' => $password
            ]),
            CURLOPT_COOKIEJAR => $this->cookieJar,
            CURLOPT_COOKIEFILE => $this->cookieJar,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception("Login failed with status: $httpCode");
        }
        
        return $response;
    }
    
    public function getClients() {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->baseUrl . '/api/v1/clients/',
            CURLOPT_COOKIEFILE => $this->cookieJar,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'X-CSRF-Token: ' . $this->csrfToken
            ]
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 401) {
            $this->reauthenticate();
            return $this->getClients();
        }
        
        if ($httpCode !== 200) {
            throw new Exception("API request failed with status: $httpCode");
        }
        
        return json_decode($response, true);
    }
    
    private function reauthenticate() {
        // Implementation depends on your login flow
        echo "Re-authenticating...\n";
    }
    
    public function __destruct() {
        if (file_exists($this->cookieJar)) {
            unlink($this->cookieJar);
        }
    }
}

// Usage
$client = new PixiesetClient();
// $client->login('your_email', 'your_password');
$clients = $client->getClients();
?>
```

</TabItem>
<TabItem value="ruby" label="Ruby">

```ruby
require 'net/http'
require 'uri'
require 'json'

class PixiesetClient
  def initialize(base_url = 'https://studio.pixieset.com')
    @base_url = base_url
    @cookies = {}
    @csrf_token = nil
  end
  
  def login(email, password)
    uri = URI("#{@base_url}/login")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    
    request = Net::HTTP::Post.new(uri)
    request.set_form_data('email' => email, 'password' => password)
    
    response = http.request(request)
    
    if response.code.to_i != 200
      raise "Login failed with status: #{response.code}"
    end
    
    # Extract cookies from response
    response.get_fields('set-cookie')&.each do |cookie|
      cookie_parts = cookie.split(';')[0].split('=', 2)
      @cookies[cookie_parts[0]] = cookie_parts[1] if cookie_parts.length == 2
    end
    
    response
  end
  
  def get_clients
    uri = URI("#{@base_url}/api/v1/clients/")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    
    request = Net::HTTP::Get.new(uri)
    request['Cookie'] = @cookies.map { |k, v| "#{k}=#{v}" }.join('; ')
    request['X-CSRF-Token'] = @csrf_token if @csrf_token
    
    response = http.request(request)
    
    case response.code.to_i
    when 200
      JSON.parse(response.body)
    when 401
      reauthenticate
      get_clients
    else
      raise "API request failed with status: #{response.code}"
    end
  end
  
  private
  
  def reauthenticate
    # Implementation depends on your login flow
    puts "Re-authenticating..."
  end
end

# Usage
client = PixiesetClient.new
# client.login('your_email', 'your_password')
clients = client.get_clients
```

</TabItem>
</Tabs>

## Error Handling

### Authentication Errors

#### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Session expired or invalid"
}
```
**Solution:** Re-authenticate and retry request

#### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```
**Solution:** Verify account has necessary permissions

## Testing Authentication

### Verify Session
Test your authentication with a simple request:

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
# Studio API
curl -X GET "https://studio.pixieset.com/api/v1/notifications/all" \
  -H "Cookie: your_session_cookie"

# Gallery API  
curl -X GET "https://galleries.pixieset.com/api/v1/data/bootstrap" \
  -H "Cookie: your_session_cookie"
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
// Studio API
const studioResponse = await fetch('https://studio.pixieset.com/api/v1/notifications/all', {
  headers: {
    'Cookie': 'your_session_cookie'
  }
});

// Gallery API
const galleryResponse = await fetch('https://galleries.pixieset.com/api/v1/data/bootstrap', {
  headers: {
    'Cookie': 'your_session_cookie'
  }
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

# Studio API
studio_response = requests.get(
    'https://studio.pixieset.com/api/v1/notifications/all',
    headers={'Cookie': 'your_session_cookie'}
)

# Gallery API
gallery_response = requests.get(
    'https://galleries.pixieset.com/api/v1/data/bootstrap',
    headers={'Cookie': 'your_session_cookie'}
)
```

</TabItem>
<TabItem value="php" label="PHP">

```php
// Studio API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://studio.pixieset.com/api/v1/notifications/all');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Cookie: your_session_cookie']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$studio_response = curl_exec($ch);
curl_close($ch);

// Gallery API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://galleries.pixieset.com/api/v1/data/bootstrap');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Cookie: your_session_cookie']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$gallery_response = curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="ruby" label="Ruby">

```ruby
require 'net/http'

# Studio API
studio_uri = URI('https://studio.pixieset.com/api/v1/notifications/all')
studio_http = Net::HTTP.new(studio_uri.host, studio_uri.port)
studio_http.use_ssl = true

studio_request = Net::HTTP::Get.new(studio_uri)
studio_request['Cookie'] = 'your_session_cookie'
studio_response = studio_http.request(studio_request)

# Gallery API
gallery_uri = URI('https://galleries.pixieset.com/api/v1/data/bootstrap')
gallery_http = Net::HTTP.new(gallery_uri.host, gallery_uri.port)
gallery_http.use_ssl = true

gallery_request = Net::HTTP::Get.new(gallery_uri)
gallery_request['Cookie'] = 'your_session_cookie'
gallery_response = gallery_http.request(gallery_request)
```

</TabItem>
</Tabs>

### Expected Response
A successful authentication returns data:
```json
{
  "data": {
    // Response data
  }
}
```

## Troubleshooting

### Common Issues

1. **Cookie not being sent**
   - Ensure cookies are included in headers
   - Check cookie domain and path

2. **CSRF token mismatch**
   - Extract fresh token from login response
   - Include in all write operations

3. **Session expiring quickly**
   - Implement keep-alive requests
   - Handle re-authentication automatically

4. **Cross-origin issues**
   - Use server-side proxy for browser apps
   - Configure CORS properly

## Next Steps

- [Explore Studio API endpoints](/docs/studio-api/overview)
- [Explore Gallery API endpoints](/docs/gallery-api/overview)
- [Learn about error handling](/docs/error-handling)
- [Understand pagination](/docs/pagination)
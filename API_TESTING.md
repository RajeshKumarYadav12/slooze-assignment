# API Testing Guide

## Base URL

```
http://localhost:5000
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔐 Authentication Endpoints

### 1. Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "nick.fury@shield.com",
  "password": "Password1!"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Nick Fury",
    "email": "nick.fury@shield.com",
    "role": "ADMIN",
    "country": "India",
    "paymentMethods": []
  }
}
```

### 2. Get Current User

```http
GET /auth/me
Authorization: Bearer YOUR_TOKEN
```

### 3. Logout

```http
POST /auth/logout
Authorization: Bearer YOUR_TOKEN
```

---

## 🍽️ Restaurant Endpoints

### 1. Get All Restaurants (Country Scoped)

```http
GET /restaurants
Authorization: Bearer YOUR_TOKEN
```

**Response:**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "name": "Mumbai Spice Kitchen",
      "country": "India",
      "address": "123 MG Road, Mumbai",
      "cuisine": "Indian",
      "rating": 4.5,
      "image": "...",
      "isActive": true
    }
  ]
}
```

### 2. Get Restaurant Details with Menu

```http
GET /restaurants/:id
Authorization: Bearer YOUR_TOKEN
```

**Response:**

```json
{
  "success": true,
  "data": {
    "restaurant": {
      "_id": "...",
      "name": "Mumbai Spice Kitchen",
      "country": "India",
      "cuisine": "Indian",
      "rating": 4.5
    },
    "menu": [
      {
        "_id": "...",
        "name": "Butter Chicken",
        "description": "Creamy tomato-based curry",
        "price": 350,
        "category": "Main Course",
        "isVegetarian": false,
        "isAvailable": true
      }
    ]
  }
}
```

### 3. Create Restaurant (Admin Only)

```http
POST /restaurants
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "New Restaurant",
  "country": "India",
  "address": "123 Test St",
  "cuisine": "Italian",
  "rating": 4.0
}
```

---

## 📦 Order Endpoints

### 1. Create Order (All Roles)

```http
POST /orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "restaurantId": "RESTAURANT_ID",
  "items": [
    {
      "menuItemId": "MENU_ITEM_ID_1",
      "quantity": 2
    },
    {
      "menuItemId": "MENU_ITEM_ID_2",
      "quantity": 1
    }
  ],
  "deliveryAddress": "123 Main Street, Mumbai"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "ORDER_ID",
    "userId": "...",
    "restaurantId": {
      "name": "Mumbai Spice Kitchen"
    },
    "country": "India",
    "items": [
      {
        "menuItemId": "...",
        "name": "Butter Chicken",
        "quantity": 2,
        "price": 350
      }
    ],
    "totalAmount": 700,
    "status": "CREATED",
    "deliveryAddress": "123 Main Street, Mumbai"
  }
}
```

### 2. Get All Orders (Country Scoped)

```http
GET /orders
Authorization: Bearer YOUR_TOKEN
```

### 3. Checkout/Pay Order (Admin, Manager Only)

```http
POST /orders/:id/checkout
Authorization: Bearer MANAGER_OR_ADMIN_TOKEN
Content-Type: application/json

{
  "paymentMethodId": "default"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order paid successfully",
  "data": {
    "_id": "...",
    "status": "PAID",
    "totalAmount": 700
  }
}
```

### 4. Cancel Order (Admin, Manager Only)

```http
POST /orders/:id/cancel
Authorization: Bearer MANAGER_OR_ADMIN_TOKEN
```

**Response:**

```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "_id": "...",
    "status": "CANCELLED"
  }
}
```

---

## 💳 Payment Endpoints

### 1. Get Payment Methods

```http
GET /payment/methods
Authorization: Bearer YOUR_TOKEN
```

### 2. Update Payment Method (Admin Only)

```http
PUT /payment/update
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "type": "credit_card",
  "cardLast4": "4242",
  "provider": "Visa",
  "isDefault": true
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Complete Order Flow (Admin)

```bash
# 1. Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nick.fury@shield.com","password":"Password1!"}'

# Save the token from response

# 2. Get restaurants
curl -X GET http://localhost:5000/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Get restaurant menu
curl -X GET http://localhost:5000/restaurants/RESTAURANT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Create order
curl -X POST http://localhost:5000/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "RESTAURANT_ID",
    "items": [{"menuItemId": "MENU_ITEM_ID", "quantity": 2}],
    "deliveryAddress": "123 Main St"
  }'

# 5. Checkout order
curl -X POST http://localhost:5000/orders/ORDER_ID/checkout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethodId": "default"}'

# 6. Get orders
curl -X GET http://localhost:5000/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Scenario 2: Test RBAC - Member Cannot Checkout

```bash
# 1. Login as Member
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"thanos@titans.com","password":"Password1!"}'

# 2. Create order (Should succeed)
curl -X POST http://localhost:5000/orders \
  -H "Authorization: Bearer MEMBER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "RESTAURANT_ID",
    "items": [{"menuItemId": "MENU_ITEM_ID", "quantity": 1}],
    "deliveryAddress": "Test Address"
  }'

# 3. Try to checkout (Should fail with 403)
curl -X POST http://localhost:5000/orders/ORDER_ID/checkout \
  -H "Authorization: Bearer MEMBER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paymentMethodId": "default"}'

# Expected Response:
# {
#   "message": "Access denied. Required roles: ADMIN, MANAGER. Your role: MEMBER"
# }
```

### Scenario 3: Test Country Restrictions

```bash
# 1. Login as Manager (India)
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"captain.marvel@shield.com","password":"Password1!"}'

# 2. Get restaurants (Should only see India restaurants)
curl -X GET http://localhost:5000/restaurants \
  -H "Authorization: Bearer MANAGER_INDIA_TOKEN"

# 3. Login as Manager (America)
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"captain.america@shield.com","password":"Password1!"}'

# 4. Get restaurants (Should only see America restaurants)
curl -X GET http://localhost:5000/restaurants \
  -H "Authorization: Bearer MANAGER_AMERICA_TOKEN"
```

---

## 🔍 Expected Error Responses

### 401 Unauthorized (No token or invalid token)

```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden (Insufficient permissions)

```json
{
  "message": "Access denied. Required roles: ADMIN, MANAGER. Your role: MEMBER"
}
```

### 404 Not Found

```json
{
  "message": "Restaurant not found"
}
```

### 400 Bad Request

```json
{
  "message": "Please provide email and password"
}
```

---

## 🎯 RBAC Testing Matrix

| Endpoint                  | Admin            | Manager        | Member         |
| ------------------------- | ---------------- | -------------- | -------------- |
| GET /restaurants          | ✅ All countries | ✅ Own country | ✅ Own country |
| POST /orders              | ✅               | ✅             | ✅             |
| POST /orders/:id/checkout | ✅               | ✅             | ❌ 403         |
| POST /orders/:id/cancel   | ✅               | ✅             | ❌ 403         |
| PUT /payment/update       | ✅               | ❌ 403         | ❌ 403         |
| POST /restaurants         | ✅               | ❌ 403         | ❌ 403         |

---

## 📝 PowerShell Testing Script

Create a file `test-api.ps1`:

```powershell
# Test API endpoints

$baseUrl = "http://localhost:5000"

# Login
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{
    email = "nick.fury@shield.com"
    password = "Password1!"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.token
Write-Host "Logged in successfully. Token: $token"

# Get restaurants
$restaurants = Invoke-RestMethod -Uri "$baseUrl/restaurants" -Method Get -Headers @{
    Authorization = "Bearer $token"
}

Write-Host "Found $($restaurants.count) restaurants"
$restaurants.data | Format-Table name, country, cuisine

# Get orders
$orders = Invoke-RestMethod -Uri "$baseUrl/orders" -Method Get -Headers @{
    Authorization = "Bearer $token"
}

Write-Host "Found $($orders.count) orders"
```

Run with:

```powershell
.\test-api.ps1
```

---

## 🎉 Happy Testing!

For any issues, check:

1. Backend is running on port 5000
2. MongoDB is running
3. Database is seeded with test data
4. Token is valid and not expired

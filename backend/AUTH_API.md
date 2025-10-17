# Authentication API Documentation

## 🔐 Authentication Endpoints

### Base URL
```
http://localhost:5000/api/auth
```

## 📝 API Endpoints

### 1. Register User
**POST** `/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-01-16T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login User
**POST** `/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get User Profile (Protected)
**GET** `/profile`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

### 4. Get All Users (Admin Only)
**GET** `/users`

**Headers:**
```
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Admin User",
        "email": "admin@businessops.com",
        "role": "admin"
      },
      {
        "id": 2,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
      }
    ]
  }
}
```

## 🔒 Authentication Flow

1. **Register** or **Login** to get a JWT token
2. **Include token** in Authorization header for protected routes
3. **Token expires** after 7 days (configurable)

## 🧪 Test Credentials

**Admin User:**
- Email: `admin@businessops.com`
- Password: `password`

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Name, email, and password are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

## 🛠️ Frontend Integration

```javascript
// Login example
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store token in localStorage
    localStorage.setItem('token', data.data.token);
    return data.data.user;
  } else {
    throw new Error(data.message);
  }
};

// Access protected route
const getProfile = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/auth/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data.data.user;
};
```

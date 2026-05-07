# Node.js TypeScript MongoDB CRUD API

A production-ready CRUD API built with **Express**, **TypeScript**, and **MongoDB**. Implements clean layered architecture with proper separation of concerns.

## 📁 Project Structure

```
src/
├── server.ts              # Main entry point, Express setup
├── config/
│   └── db.ts             # MongoDB connection & lifecycle
├── models/
│   └── user.model.ts     # Mongoose schema & interfaces
├── services/
│   └── user.service.ts   # Business logic & validation
├── controllers/
│   └── user.controller.ts # HTTP handlers (BaseController)
└── routes/
    └── user.route.ts     # Route definitions
```

## 🏗️ Architecture Layers

| Layer | Responsibility | Location |
|-------|-----------------|----------|
| **Routes** | HTTP endpoint mapping | `routes/` |
| **Controllers** | Request/response handling, no business logic | `controllers/` |
| **Services** | Business logic, validation, error handling | `services/` |
| **Models** | Database schema & types | `models/` |
| **Config** | Database connection management | `config/` |

## 📋 Features

✅ **Full CRUD Operations** - Create, Read, Update, Delete users  
✅ **Input Validation** - Email format, age range, required fields  
✅ **Error Handling** - Consistent error responses with meaningful messages  
✅ **Pagination** - Support for page-based user listing  
✅ **TypeScript** - Full type safety across all layers  
✅ **Async/Await** - Modern async patterns  
✅ **Base Controller** - Reusable response & error handling  

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Update `.env` with your MongoDB URI:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crud-app
NODE_ENV=development
```

### 3. Start MongoDB

```bash
# Using MongoDB locally
mongod

# Or use MongoDB Atlas connection string in .env
```

### 4. Run the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Get All Users
```
GET /api/users?page=1&limit=10
```
Response:
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

### Create User
```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "age": 30
}
```

### Get User by ID
```
GET /api/users/:id
```

### Get User by Email
```
GET /api/users/email?email=john@example.com
```

### Update User
```
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "age": 31
}
```

### Delete User
```
DELETE /api/users/:id
```

### Get User Count
```
GET /api/users/count
```

## 🧪 Example Usage (curl)

```bash
# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "age": 28
  }'

# Get all users
curl http://localhost:5000/api/users

# Get user by ID
curl http://localhost:5000/api/users/USER_ID

# Update user
curl -X PUT http://localhost:5000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"age": 29}'

# Delete user
curl -X DELETE http://localhost:5000/api/users/USER_ID
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **typescript** - Language
- **ts-node** - Development runtime
- **dotenv** - Environment variables
- **cors** - Cross-origin requests

## 🔍 Key Implementation Details

### Service Layer Pattern
- Input validation & normalization
- Business logic orchestration
- Database error handling
- No HTTP concerns

### BaseController Pattern
- `sendSuccess()` - Consistent success responses
- `sendError()` - Consistent error responses  
- `handleAsyncError()` - Unified error catching

### User Model
- Email validation & uniqueness
- Name length validation
- Age range validation (0-150)
- Timestamps (createdAt, updatedAt)

## 🛠️ Building & Deployment

```bash
# TypeScript compilation
npm run build

# Output to /dist directory
ls dist/

# Run compiled version
npm start
```

## 📝 Notes

- MongoDB must be running before starting the server
- Email addresses are normalized to lowercase
- Duplicate emails are rejected
- All responses follow a consistent format `{ success, data/message }`
- Timestamps are automatically managed by MongoDB

## 📄 License

ISC

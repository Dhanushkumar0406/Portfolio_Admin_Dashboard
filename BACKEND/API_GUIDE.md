# 3D Portfolio Backend API - Complete Guide

## 🎉 Status: 100% COMPLETE

All backend code has been successfully created!

---

## 📦 What Was Created

### Core Application
- ✅ **main.py** - FastAPI application with CORS, error handling, and static file serving
- ✅ **deps.py** - Authentication dependencies and database session management

### Database Layer (Previously Created)
- ✅ 7 SQLAlchemy models
- ✅ 8 Pydantic schemas
- ✅ 5 CRUD operation classes
- ✅ Database configuration and security

### API Layer (Just Created)
- ✅ 8 API endpoint modules with 40+ endpoints
- ✅ JWT authentication system
- ✅ File upload handling
- ✅ 3D model validation
- ✅ Email notifications

### Middleware
- ✅ Global error handling
- ✅ CORS configuration
- ✅ Request validation

### Utilities
- ✅ File handler (images, 3D models)
- ✅ Model validator (GLB, GLTF, FBX, OBJ)
- ✅ Email sender (optional)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update:
- `DATABASE_URL` - Your PostgreSQL connection string
- `SECRET_KEY` - Generate with: `openssl rand -hex 32`
- `BACKEND_CORS_ORIGINS` - Your frontend URL

### 3. Initialize Database

```bash
python init_db.py
```

This will:
- Create all tables
- Create superuser: `admin@example.com` / `admin123`
- Seed sample data

### 4. Run the Server

```bash
uvicorn app.main:app --reload
```

Server will start at:
- **API**: http://localhost:8006
- **Docs**: http://localhost:8006/docs (Interactive Swagger UI)
- **ReDoc**: http://localhost:8006/redoc (Alternative documentation)

---

## 📚 API Endpoints Reference

### Authentication (`/api/v1/auth`)

#### Register New User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=admin@example.com&password=admin123
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

---

### Projects (`/api/v1/projects`)

#### List All Projects
```http
GET /api/v1/projects?skip=0&limit=10&featured=true
```

Query Parameters:
- `skip` - Pagination offset (default: 0)
- `limit` - Results per page (default: 100, max: 100)
- `category` - Filter by category
- `featured` - Show only featured projects (true/false)

#### Get Project by ID
```http
GET /api/v1/projects/1
```

#### Create Project (Auth Required)
```http
POST /api/v1/projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "3D Portfolio Website",
  "description": "Interactive portfolio with Three.js",
  "short_description": "3D portfolio built with React",
  "image_url": "/uploads/projects/image.jpg",
  "github_url": "https://github.com/user/project",
  "live_url": "https://example.com",
  "technologies": ["React", "Three.js", "FastAPI"],
  "category": "Web Application",
  "featured": true,
  "model_url": "/uploads/models/project.glb",
  "three_config": {
    "camera": {"position": [0, 2, 5]},
    "lighting": {"ambient": 0.5}
  }
}
```

#### Update Project (Auth Required)
```http
PUT /api/v1/projects/1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "featured": true
}
```

#### Delete Project (Auth Required)
```http
DELETE /api/v1/projects/1
Authorization: Bearer <access_token>
```

---

### Skills (`/api/v1/skills`)

#### Create Skill (Auth Required)
```http
POST /api/v1/skills
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "React",
  "category": "Frontend",
  "proficiency": 90,
  "years_experience": 3.5,
  "icon_url": "/uploads/icons/react.svg",
  "color": "#61DAFB"
}
```

---

### File Upload (`/api/v1/upload`)

#### Upload Image
```http
POST /api/v1/upload/image?category=projects
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <image_file>
```

Response:
```json
{
  "message": "Image uploaded successfully",
  "file_path": "projects/uuid.jpg",
  "url": "/uploads/projects/uuid.jpg"
}
```

#### Upload 3D Model
```http
POST /api/v1/upload/model
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <model_file.glb>
```

Supported formats: `.glb`, `.gltf`, `.fbx`, `.obj`

#### Upload Texture
```http
POST /api/v1/upload/texture
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <texture_file.jpg>
```

Supported formats: `.jpg`, `.png`, `.exr`, `.hdr`

---

### 3D Assets (`/api/v1/three-config`)

#### Get Config by Scene Name
```http
GET /api/v1/three-config/by-scene/hero
```

#### Create 3D Configuration (Auth Required)
```http
POST /api/v1/three-config
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "scene_name": "hero",
  "scene_type": "hero",
  "description": "Hero section 3D scene",
  "settings": {
    "camera": {
      "position": [0, 5, 10],
      "fov": 75,
      "near": 0.1,
      "far": 1000
    },
    "lighting": {
      "ambient": {"color": "#ffffff", "intensity": 0.5},
      "directional": {"color": "#ffffff", "intensity": 1.0, "position": [5, 5, 5]}
    },
    "models": [
      {
        "url": "/models/avatar.glb",
        "position": [0, 0, 0],
        "rotation": [0, 0, 0],
        "scale": [1, 1, 1]
      }
    ],
    "effects": {
      "particles": true,
      "bloom": true,
      "fog": {"color": "#000000", "near": 1, "far": 100}
    },
    "controls": {
      "enabled": true,
      "autoRotate": false,
      "autoRotateSpeed": 2.0
    }
  },
  "model_url": "/uploads/models/avatar.glb",
  "environment_url": "/uploads/hdri/studio.hdr",
  "is_active": true
}
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:8006/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=admin123"

# Get projects (save token from login response)
curl http://localhost:8006/api/v1/projects

# Create project (authenticated)
curl -X POST http://localhost:8006/api/v1/projects \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Project","description":"Test"}'
```

### Using Python

```python
import requests

BASE_URL = "http://localhost:8006/api/v1"

# Login
response = requests.post(
    f"{BASE_URL}/auth/login",
    data={"username": "admin@example.com", "password": "admin123"}
)
token = response.json()["access_token"]

# Get projects
response = requests.get(
    f"{BASE_URL}/projects",
    headers={"Authorization": f"Bearer {token}"}
)
print(response.json())
```

### Using JavaScript/Fetch

```javascript
const BASE_URL = "http://localhost:8006/api/v1";

// Login
const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
  method: "POST",
  headers: {"Content-Type": "application/x-www-form-urlencoded"},
  body: "username=admin@example.com&password=admin123"
});
const { access_token } = await loginResponse.json();

// Get projects
const projectsResponse = await fetch(`${BASE_URL}/projects`, {
  headers: {"Authorization": `Bearer ${access_token}`}
});
const projects = await projectsResponse.json();
```

---

## 🔐 Authentication Flow

1. **Register** - Create new user account
2. **Login** - Get access token and refresh token
3. **Use Access Token** - Include in `Authorization: Bearer <token>` header
4. **Token Expires** - Use refresh token to get new access token
5. **Refresh Token** - Send refresh token to `/auth/refresh`

Access Token: 30 minutes (configurable)
Refresh Token: 7 days (configurable)

---

## 📁 File Upload Guidelines

### Image Files
- **Formats**: JPG, JPEG, PNG, GIF, WEBP
- **Max Size**: 10MB (configurable)
- **Categories**: projects, profile, certificates

### 3D Models
- **Formats**: GLB, GLTF, FBX, OBJ
- **Max Size**: 50MB (configurable)
- **Validation**: GLB files are validated for correct format

### Textures
- **Formats**: JPG, PNG, EXR, HDR
- **Max Size**: 10MB (configurable)
- **Use**: For 3D models and environment maps

---

## 🛠️ Configuration

### Environment Variables

```env
# Application
APP_NAME=3D Portfolio API
APP_VERSION=1.0.0
DEBUG=True

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/portfolio_db

# Security
SECRET_KEY=<generate-with-openssl-rand-hex-32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# File Upload
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE=10485760
```

---

## 📖 Interactive API Documentation

Once the server is running, visit:

**Swagger UI**: http://localhost:8006/docs
- Interactive API testing
- Try out endpoints directly
- View request/response schemas
- Authentication support

**ReDoc**: http://localhost:8006/redoc
- Clean, organized documentation
- Better for reading and understanding
- Downloadable OpenAPI spec

---

## 🎯 Common Use Cases

### 1. Build a Portfolio Website
- Fetch projects, skills, experience
- Display user profile
- Show 3D visualizations

### 2. Admin Dashboard
- Login as admin
- Create/update/delete content
- Upload images and 3D models
- Configure 3D scenes

### 3. Mobile App Backend
- RESTful API for mobile apps
- JWT authentication
- File uploads from camera
- Offline-first with sync

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: could not connect to server
```
**Solution**: Make sure PostgreSQL is running and `DATABASE_URL` is correct

### Import Error
```
ModuleNotFoundError: No module named 'app'
```
**Solution**: Run from backend directory: `cd backend && uvicorn app.main:app --reload`

### Authentication Error
```
401 Unauthorized: Could not validate credentials
```
**Solution**:
- Check if token is valid
- Token may have expired (get new token)
- Include `Authorization: Bearer <token>` header

### File Upload Error
```
413 Request Entity Too Large
```
**Solution**: File exceeds MAX_UPLOAD_SIZE. Increase in settings or compress file.

---

## 🚀 Production Deployment

### Using Docker

```dockerfile
# Dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8006"]
```

```bash
docker build -t portfolio-api .
docker run -p 8006:8006 portfolio-api
```

### Using Gunicorn

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

## 📝 License

MIT License

---

## 🎉 You're All Set!

The complete backend API is ready to use. Start the server and begin building your 3D portfolio frontend!

For questions or issues, refer to the code comments or FastAPI documentation.

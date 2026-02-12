# 3D Portfolio - Backend API

FastAPI backend for the 3D Portfolio application.

## Database Design

### Tables

1. **users** - User accounts and authentication
2. **projects** - Portfolio projects
3. **skills** - User skills and proficiencies
4. **experience** - Work experience history
5. **education** - Academic background and certifications
6. **three_config** - 3D scene configurations
7. **contacts** - Contact form submissions

### Entity Relationships

```
users (1) ─→ (Many) projects
users (1) ─→ (Many) skills
users (1) ─→ (Many) experience
users (1) ─→ (Many) education
users (1) ─→ (Many) three_config
contacts (standalone - no FK)
```

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and update:
# - DATABASE_URL
# - SECRET_KEY (generate with: openssl rand -hex 32)
# - Other configurations as needed
```

### 4. Setup PostgreSQL Database

```sql
-- Create database
CREATE DATABASE portfolio_db;

-- Create user (optional)
CREATE USER portfolio_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
```

### 5. Initialize Database

```bash
# Create tables and seed initial data
python init_db.py
```

This will:
- Create all database tables
- Create a superuser account (admin@example.com / admin123)
- Seed sample data

**⚠️ IMPORTANT:** Change the default admin password immediately!

### 6. Run the Application

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8006

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8006 --workers 4
```

The API will be available at:
- API: http://localhost:8006
- Docs: http://localhost:8006/docs
- ReDoc: http://localhost:8006/redoc

## Database Migrations (Alembic)

### Initialize Alembic (if not already done)

```bash
alembic init alembic
```

### Create Migration

```bash
alembic revision --autogenerate -m "migration description"
```

### Run Migrations

```bash
# Upgrade to latest
alembic upgrade head

# Downgrade one version
alembic downgrade -1

# View migration history
alembic history
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh access token

### Projects
- `GET /api/v1/projects` - List all projects
- `GET /api/v1/projects/{id}` - Get project details
- `POST /api/v1/projects` - Create project (auth required)
- `PUT /api/v1/projects/{id}` - Update project (auth required)
- `DELETE /api/v1/projects/{id}` - Delete project (auth required)

### Skills
- `GET /api/v1/skills` - List all skills
- `POST /api/v1/skills` - Create skill (auth required)
- `PUT /api/v1/skills/{id}` - Update skill (auth required)
- `DELETE /api/v1/skills/{id}` - Delete skill (auth required)

### Experience
- `GET /api/v1/experience` - List experience entries
- `POST /api/v1/experience` - Create experience (auth required)
- `PUT /api/v1/experience/{id}` - Update experience (auth required)
- `DELETE /api/v1/experience/{id}` - Delete experience (auth required)

### Education
- `GET /api/v1/education` - List education entries
- `POST /api/v1/education` - Create education (auth required)
- `PUT /api/v1/education/{id}` - Update education (auth required)
- `DELETE /api/v1/education/{id}` - Delete education (auth required)

### 3D Configuration
- `GET /api/v1/three-config` - List 3D configurations
- `GET /api/v1/three-config/{scene_name}` - Get config by scene name
- `POST /api/v1/three-config` - Create configuration (auth required)
- `PUT /api/v1/three-config/{id}` - Update configuration (auth required)

### File Upload
- `POST /api/v1/upload/image` - Upload image
- `POST /api/v1/upload/model` - Upload 3D model
- `POST /api/v1/upload/texture` - Upload texture

### Contact
- `POST /api/v1/contact` - Submit contact form
- `GET /api/v1/contact` - List contacts (admin only)

## Development

### Code Style

```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .
```

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app tests/
```

## Project Structure

```
backend/
├── app/
│   ├── api/            # API endpoints
│   ├── core/           # Core configuration
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   ├── crud/           # CRUD operations
│   ├── middleware/     # Middleware
│   └── utils/          # Utilities
├── uploads/            # File uploads
├── tests/              # Test files
├── alembic/            # Database migrations
├── .env                # Environment variables
├── requirements.txt    # Python dependencies
└── init_db.py          # Database initialization
```

## Environment Variables

See `.env.example` for all available configuration options.

## Security Notes

- Always use HTTPS in production
- Change default SECRET_KEY
- Change default admin password
- Set strong DATABASE_URL password
- Configure CORS origins properly
- Validate and sanitize all file uploads
- Implement rate limiting for public endpoints

## License

MIT

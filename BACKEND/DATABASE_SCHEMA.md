# Database Schema Documentation

## Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                          USERS TABLE                              │
│──────────────────────────────────────────────────────────────────│
│ id (PK) INTEGER                                                   │
│ email VARCHAR(255) UNIQUE NOT NULL                                │
│ hashed_password VARCHAR(255) NOT NULL                             │
│ full_name VARCHAR(255)                                            │
│ is_active BOOLEAN DEFAULT TRUE                                    │
│ is_superuser BOOLEAN DEFAULT FALSE                                │
│ created_at TIMESTAMP DEFAULT NOW()                                │
│ updated_at TIMESTAMP                                              │
└───────────────────────────┬──────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    PROJECTS     │ │     SKILLS      │ │   EXPERIENCE    │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ id (PK)         │ │ id (PK)         │ │ id (PK)         │
│ user_id (FK) ───┼─┤ user_id (FK) ───┼─┤ user_id (FK) ───┤
│ title           │ │ name            │ │ company         │
│ description     │ │ category        │ │ position        │
│ image_url       │ │ proficiency     │ │ start_date      │
│ github_url      │ │ icon_url        │ │ end_date        │
│ youtube_url     │ │ color           │ │ description     │
│ live_url        │ │ display_order   │ │ is_current      │
│ technologies[]  │ │ three_config    │ │ location        │
│ category        │ │ created_at      │ │ created_at      │
│ tags[]          │ │ updated_at      │ │ updated_at      │
│ featured        │ └─────────────────┘ └─────────────────┘
│ display_order   │
│ status          │         │               │
│ model_url       │         ▼               ▼
│ three_config{}  │ ┌─────────────────┐ ┌─────────────────┐
│ created_at      │ │   EDUCATION     │ │  THREE_CONFIG   │
│ updated_at      │ ├─────────────────┤ ├─────────────────┤
│ project_date    │ │ id (PK)         │ │ id (PK)         │
└─────────────────┘ │ user_id (FK) ───┤ │ user_id (FK) ───┤
                    │ institution     │ │ scene_name      │
                    │ degree          │ │ scene_type      │
                    │ field_of_study  │ │ description     │
                    │ grade           │ │ settings{}      │
                    │ start_date      │ │ model_url       │
                    │ end_date        │ │ environment_url │
                    │ is_certification│ │ texture_urls[]  │
                    │ certificate_url │ │ is_active       │
                    │ created_at      │ │ created_at      │
                    │ updated_at      │ │ updated_at      │
                    └─────────────────┘ └─────────────────┘

                    ┌─────────────────┐
                    │    CONTACTS     │  (Standalone - No FK)
                    ├─────────────────┤
                    │ id (PK)         │
                    │ name            │
                    │ email           │
                    │ phone           │
                    │ subject         │
                    │ message         │
                    │ is_read         │
                    │ is_replied      │
                    │ ip_address      │
                    │ user_agent      │
                    │ created_at      │
                    │ read_at         │
                    │ replied_at      │
                    └─────────────────┘
```

## Database Statistics

- **Total Tables:** 7
- **Tables with Foreign Keys:** 6 (all except contacts)
- **Parent Table:** users (1)
- **Child Tables:** projects, skills, experience, education, three_config (5)
- **Standalone Tables:** contacts (1)

## Table Descriptions

### 1. users
**Purpose:** Store user accounts and authentication information

**Key Fields:**
- `email`: Unique email address for login
- `hashed_password`: Bcrypt hashed password
- `is_superuser`: Admin privileges flag

**Relationships:**
- One user has many projects
- One user has many skills
- One user has many experience entries
- One user has many education entries
- One user has many 3D configurations

---

### 2. projects
**Purpose:** Store portfolio projects with details and media

**Key Fields:**
- `technologies`: JSON array of tech stack
- `featured`: Boolean flag for homepage showcase
- `model_url`: URL to 3D model file (.glb, .gltf)
- `three_config`: JSON object for 3D scene settings

**Use Cases:**
- Display project portfolio grid
- Show featured projects on homepage
- Filter by category or technology
- 3D project visualization

---

### 3. skills
**Purpose:** Store user skills with proficiency levels

**Key Fields:**
- `proficiency`: 0-100 percentage value
- `category`: Grouping (Frontend, Backend, 3D, Tools, etc.)
- `icon_url`: Skill logo/icon path
- `three_config`: Optional 3D visualization settings

**Use Cases:**
- Skills section with proficiency bars
- Group skills by category
- 3D skill visualization (orbs, particles, etc.)

---

### 4. experience
**Purpose:** Store work experience and employment history

**Key Fields:**
- `is_current`: Flag for current employment
- `start_date`, `end_date`: Employment period
- `responsibilities`: Can store JSON array
- `achievements`: Can store JSON array

**Use Cases:**
- Career timeline display
- Current position highlighting
- Experience filtering and sorting

---

### 5. education
**Purpose:** Store academic background and certifications

**Key Fields:**
- `is_certification`: Distinguish certifications from degrees
- `certificate_url`: Link to certificate document
- `credential_id`, `credential_url`: Verification links
- `grade`: GPA, percentage, or grade descriptor

**Use Cases:**
- Education timeline
- Certification showcase
- Academic achievements display

---

### 6. three_config
**Purpose:** Store 3D scene configurations for Three.js

**Key Fields:**
- `scene_name`: Unique identifier (e.g., "hero", "about")
- `settings`: JSON object containing camera, lighting, models, effects, controls

**JSON Structure Example:**
```json
{
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
}
```

---

### 7. contacts
**Purpose:** Store contact form submissions (standalone table)

**Key Fields:**
- `is_read`, `is_replied`: Status tracking
- `ip_address`, `user_agent`: Security tracking
- `read_at`, `replied_at`: Timestamp tracking

**Use Cases:**
- Contact form submissions
- Admin inbox for messages
- Track response status

## Indexes

### Primary Indexes
- All tables: `id` (Primary Key, Auto-increment)

### Unique Indexes
- `users.email`
- `three_config.scene_name`

### Search Indexes
- `projects.title`
- `projects.category`
- `skills.name`
- `contacts.email`

### Foreign Key Indexes
- `projects.user_id`
- `skills.user_id`
- `experience.user_id`
- `education.user_id`
- `three_config.user_id`

## Cascade Behavior

All foreign keys use `ON DELETE CASCADE`:
- When a user is deleted, all related projects, skills, experience, education, and three_config entries are automatically deleted
- Ensures referential integrity
- Prevents orphaned records

## Data Types Reference

| Type | Usage | Example |
|------|-------|---------|
| INTEGER | IDs, counts, orders | user_id, display_order |
| VARCHAR(n) | Short text with limit | email, name, title |
| TEXT | Long text, unlimited | description, message |
| BOOLEAN | True/false flags | is_active, featured |
| TIMESTAMP | Date and time | created_at, start_date |
| JSON | Complex structures | technologies[], settings{} |
| FLOAT | Decimal numbers | proficiency, years_experience |

## Best Practices

1. **Always use transactions** for multiple related operations
2. **Pagination** for large result sets (use skip/limit)
3. **Eager loading** for related data to avoid N+1 queries
4. **JSON validation** for complex JSON fields
5. **Regular backups** of database
6. **Index frequently queried** foreign keys
7. **Monitor query performance** and add indexes as needed

## Security Considerations

1. ✅ Never store plain passwords (bcrypt hashing used)
2. ✅ Parameterized queries (SQLAlchemy ORM)
3. ✅ Password validation (min 8 characters)
4. ✅ Email validation
5. ✅ Cascade deletes for data integrity
6. ⚠️ Implement rate limiting for contact forms
7. ⚠️ Validate file uploads (size, type)
8. ⚠️ Use HTTPS in production
9. ⚠️ Regular security audits

## Migration Strategy

### Phase 1: Core Tables (Day 1)
1. users
2. projects
3. skills

### Phase 2: Additional Info (Day 2)
4. experience
5. education

### Phase 3: Advanced Features (Day 3)
6. three_config
7. contacts

### Phase 4: Optimizations (Ongoing)
- Add additional indexes based on query patterns
- Add full-text search capabilities
- Add database views for complex queries
- Add triggers for auto-updating timestamps

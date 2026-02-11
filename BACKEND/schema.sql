-- ============================================================================
-- 3D PORTFOLIO DATABASE SCHEMA
-- PostgreSQL 12+
-- ============================================================================

-- Create database (run this separately)
-- CREATE DATABASE portfolio_db;
-- \c portfolio_db

-- ============================================================================
-- TABLE: users (Root table)
-- ============================================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);

COMMENT ON TABLE users IS 'User accounts and authentication';
COMMENT ON COLUMN users.hashed_password IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.is_superuser IS 'Admin privileges flag';

-- ============================================================================
-- TABLE: projects
-- ============================================================================

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),

    -- Media URLs
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    github_url VARCHAR(500),
    youtube_url VARCHAR(500),
    live_url VARCHAR(500),

    -- Project Details
    technologies JSON,
    category VARCHAR(100),
    tags JSON,

    -- Display Settings
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'completed',

    -- 3D Related
    model_url VARCHAR(500),
    three_config JSON,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    project_date TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_title ON projects(title);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured);

COMMENT ON TABLE projects IS 'Portfolio projects with 3D asset support';
COMMENT ON COLUMN projects.technologies IS 'JSON array of technologies used';
COMMENT ON COLUMN projects.three_config IS 'JSON object for 3D scene configuration';

-- ============================================================================
-- TABLE: skills
-- ============================================================================

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Skill Information
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    proficiency FLOAT CHECK (proficiency >= 0 AND proficiency <= 100),
    years_experience FLOAT CHECK (years_experience >= 0),

    -- Display
    icon_url VARCHAR(500),
    color VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    three_config VARCHAR(500),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_skills_user_id ON skills(user_id);
CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_category ON skills(category);

COMMENT ON TABLE skills IS 'User skills with proficiency levels';
COMMENT ON COLUMN skills.proficiency IS 'Proficiency percentage (0-100)';

-- ============================================================================
-- TABLE: experience
-- ============================================================================

CREATE TABLE experience (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Company Information
    company VARCHAR(255) NOT NULL,
    company_url VARCHAR(500),
    company_logo VARCHAR(500),

    -- Position Details
    position VARCHAR(255) NOT NULL,
    employment_type VARCHAR(100),
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT FALSE,

    -- Date Range
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_current BOOLEAN DEFAULT FALSE,

    -- Description
    description TEXT,
    responsibilities TEXT,
    achievements TEXT,

    -- Display
    display_order INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_experience_user_id ON experience(user_id);
CREATE INDEX idx_experience_is_current ON experience(is_current);

COMMENT ON TABLE experience IS 'Work experience and employment history';
COMMENT ON COLUMN experience.is_current IS 'Currently employed at this position';

-- ============================================================================
-- TABLE: education
-- ============================================================================

CREATE TABLE education (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Institution Information
    institution VARCHAR(255) NOT NULL,
    institution_url VARCHAR(500),
    institution_logo VARCHAR(500),

    -- Degree Information
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    grade VARCHAR(50),
    grade_scale VARCHAR(50),

    -- Date Range
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_current BOOLEAN DEFAULT FALSE,

    -- Description
    description TEXT,
    activities TEXT,
    achievements TEXT,

    -- Certification specific
    is_certification BOOLEAN DEFAULT FALSE,
    certificate_url VARCHAR(500),
    credential_id VARCHAR(255),
    credential_url VARCHAR(500),

    -- Display
    display_order INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_education_user_id ON education(user_id);
CREATE INDEX idx_education_is_certification ON education(is_certification);

COMMENT ON TABLE education IS 'Academic background and certifications';
COMMENT ON COLUMN education.is_certification IS 'Flag to distinguish certifications from degrees';

-- ============================================================================
-- TABLE: three_config
-- ============================================================================

CREATE TABLE three_config (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Scene Information
    scene_name VARCHAR(100) UNIQUE NOT NULL,
    scene_type VARCHAR(50),
    description VARCHAR(500),

    -- 3D Configuration
    settings JSON,

    -- Asset URLs
    model_url VARCHAR(500),
    environment_url VARCHAR(500),
    texture_urls JSON,

    -- Display Settings
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_three_config_user_id ON three_config(user_id);
CREATE UNIQUE INDEX idx_three_config_scene_name ON three_config(scene_name);

COMMENT ON TABLE three_config IS '3D scene configurations for Three.js';
COMMENT ON COLUMN three_config.settings IS 'JSON: camera, lighting, models, effects, controls';

-- ============================================================================
-- TABLE: contacts (Standalone - No Foreign Key)
-- ============================================================================

CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,

    -- Contact Information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),

    -- Message
    subject VARCHAR(255),
    message TEXT NOT NULL,

    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    is_replied BOOLEAN DEFAULT FALSE,

    -- Tracking
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_is_read ON contacts(is_read);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

COMMENT ON TABLE contacts IS 'Contact form submissions (standalone table)';

-- ============================================================================
-- EXAMPLE DATA (Optional)
-- ============================================================================

-- Insert sample user (password: admin123, hashed with bcrypt)
INSERT INTO users (email, hashed_password, full_name, is_superuser) VALUES
('admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5aKKqKqKqKqKq', 'Admin User', TRUE);

-- Note: Use the init_db.py script for proper initialization with real hashed passwords

-- ============================================================================
-- USEFUL QUERIES
-- ============================================================================

-- Get user with all related data
-- SELECT u.*,
--        json_agg(DISTINCT p.*) as projects,
--        json_agg(DISTINCT s.*) as skills
-- FROM users u
-- LEFT JOIN projects p ON p.user_id = u.id
-- LEFT JOIN skills s ON s.user_id = u.id
-- WHERE u.id = 1
-- GROUP BY u.id;

-- Get featured projects
-- SELECT * FROM projects WHERE featured = TRUE ORDER BY display_order, created_at DESC;

-- Get skills by category
-- SELECT category, json_agg(skills.*) as skills
-- FROM skills
-- WHERE user_id = 1
-- GROUP BY category
-- ORDER BY category;

-- Get current employment
-- SELECT * FROM experience WHERE is_current = TRUE ORDER BY start_date DESC;

-- Get unread contacts
-- SELECT * FROM contacts WHERE is_read = FALSE ORDER BY created_at DESC;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

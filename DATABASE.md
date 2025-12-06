## Database Overview

### Tables

Full table can be found on the Supabase dashboard.

**strength_levels**: Lookup table for strength rank multipliers (E-S)
- `level`: strength_rank PRIMARY KEY
  - Strength rank enum (E, D, C, B, A, S)
- `multiplier`: DECIMAL(4, 2) NOT NULL
  - Multiplier for experience calculation
- `updated_at`: TIMESTAMP DEFAULT NOW()
  - Timestamp of last update

**users**: Core user accounts with level and experience tracking
- `id`: UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
  - User identifier linked to authentication
- `username`: VARCHAR(50) NOT NULL
  - Username (max 50 chars)
- `usertag`: VARCHAR(50) UNIQUE NOT NULL
  - Unique usertag for potential social features
- `created_at`: TIMESTAMP DEFAULT NOW()
  - Account creation timestamp
- `last_login`: TIMESTAMP
  - Last login timestamp
- `verified`: BOOLEAN DEFAULT FALSE
  - Account verification status
- `profile_complete`: BOOLEAN DEFAULT FALSE
  - Whether user has defined their tasks
- `level`: INT DEFAULT 1
  - Overall player level
- `experience`: DECIMAL(10, 2) DEFAULT 0
  - Total experience points
- `updated_at`: TIMESTAMP DEFAULT NOW()
  - Timestamp of last update

**user_attributes**: Player-defined attributes that level independently
- `id`: SERIAL PRIMARY KEY
  - Unique attribute identifier
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - Owner of the attribute
- `name`: VARCHAR(50) NOT NULL, UNIQUE (user_id, name)
  - Attribute name (max 50 chars, unique per user)
- `level`: INT DEFAULT 1
  - Current attribute level
- `experience`: DECIMAL(10, 2) DEFAULT 0
  - Attribute experience points
- `created_at`: TIMESTAMP DEFAULT NOW()
  - Creation timestamp
- `updated_at`: TIMESTAMP DEFAULT NOW()
  - Timestamp of last update

**tasks**: Quests assigned by users with frequency, streak, and strength mechanics
- `id`: SERIAL PRIMARY KEY
  - Unique task identifier
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - Owner of the task
- `name`: VARCHAR(200) NOT NULL
  - Task name (max 200 chars)
- `description`: TEXT
  - Optional task description
- `created_at`: TIMESTAMP DEFAULT NOW()
  - Creation timestamp
- `is_completed`: BOOLEAN DEFAULT FALSE
  - Completion status
- `frequency`: INT DEFAULT 1 CHECK (frequency >= 0)
  - How often task must be completed (daily by default)
- `rest_frequency`: INT DEFAULT 0 CHECK (rest_frequency >= 0)
  - Allowed rest days without streak reset
- `last_rest_date`: DATE
  - Date of last rest day
- `experience_share`: INT NOT NULL CHECK (experience_share BETWEEN 0 AND 100)
  - A share of base daily points (0-100) that the user allots to a particular task completion (presumably based on difficulty/importance of the task)
- `streak`: INT DEFAULT 0
  - Current streak count
- `strength_points`: INT DEFAULT 0
  - Accumulated strength points
- `strength_level`: strength_rank REFERENCES strength_levels(level) DEFAULT 'E'
  - Current strength rank (E-S)
- `last_completed_date`: DATE
  - Date of last completion
- `updated_at`: TIMESTAMP DEFAULT NOW()
  - Timestamp of last update

**task_completions**: Records each task completion with streak and experience earned
- `id`: SERIAL PRIMARY KEY
  - Unique completion record identifier
- `task_id`: INT REFERENCES tasks(id) ON DELETE CASCADE
  - Reference to completed task
- `completed_at`: TIMESTAMP DEFAULT NOW()
  - Completion timestamp
- `streak_count`: INT DEFAULT 1
  - Streak at time of completion
- `experience_earned`: DECIMAL(8, 2) DEFAULT 0
  - Experience points awarded
- `updated_at`: TIMESTAMP DEFAULT NOW()
  - Timestamp of last update

**experience_log**: Audit trail of all experience transactions
- `id`: SERIAL PRIMARY KEY
  - Unique log entry identifier
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - User who earned/lost experience
- `task_id`: INT REFERENCES tasks(id) ON DELETE SET NULL
  - Related task (nullable)
- `experience_amount`: DECIMAL(8, 2) NOT NULL
  - Experience points in transaction
- `reason`: TEXT
  - Description of transaction
- `created_at`: TIMESTAMP DEFAULT NOW()
  - Transaction timestamp

**tasks_attributes**: Junction table linking tasks to attributes with power multipliers
- `id`: SERIAL PRIMARY KEY
  - Unique junction record identifier
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - Owner of the task-attribute relationship
- `task_id`: INT REFERENCES tasks(id) ON DELETE CASCADE
  - Reference to task
- `attribute_id`: INT REFERENCES user_attributes(id) ON DELETE CASCADE
  - Reference to attribute
- `attribute_power`: INT DEFAULT 1
  - Power multiplier for this attribute
- `updated_at`: TIMESTAMP DEFAULT NOW()
  - Timestamp of last update
- UNIQUE (task_id, attribute_id)
  - Ensures each task-attribute pair is unique

### Key Features

- Strength rank system (E-S) applies experience multipliers to task rewards
- Frequency and rest_frequency fields support flexible habit scheduling
- Experience shared across user level, individual attributes, and task streaks
- Cascading deletes maintain referential integrity when users or tasks are removed
- Trigger upon insertion to Supabase auth.users that inserts user to project users table
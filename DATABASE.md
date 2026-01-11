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
- `email`: VARCHAR(255) UNIQUE NOT NULL
  - User email address
- `created_at`: TIMESTAMP DEFAULT NOW()
  - Account creation timestamp
- `last_login`: TIMESTAMP
  - Last login timestamp
- `verified`: BOOLEAN DEFAULT FALSE
  - Account verification status
- `profile_complete`: BOOLEAN DEFAULT FALSE
  - Whether user has defined their quests and attributes
- `level`: INT DEFAULT 1
  - Overall player level
- `experience`: DECIMAL(10, 2) DEFAULT 0
  - Total experience points
- `updated_at`: TIMESTAMP DEFAULT NOW()
  - Timestamp of last update

**attributes**: Player-defined attributes that level independently

- `id`: SERIAL PRIMARY KEY
  - Unique attribute identifier
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - Owner of the attribute
- `name`: VARCHAR(50) NOT NULL
  - Attribute name (max 50 chars, unique per user)
- `level`: INT DEFAULT 1
  - Current attribute level
- `experience`: DECIMAL(10, 2) DEFAULT 0
  - Attribute experience points
- `position`: INT NOT NULL CHECK (position >= 0)
  - Display order for attribute list (unique per user)
  - Position is zero-indexed and handled before insertion in application logic
- `created_at`: TIMESTAMP DEFAULT NOW()
  - Creation timestamp
- `updated_at`: TIMESTAMP DEFAULT NOW()
  - Timestamp of last update
- UNIQUE (user_id, name)
  - Ensures attribute names are unique per user
- UNIQUE (user_id, position)
  - Ensures each user has unique attribute ordering

**quests**: Quests assigned by users with frequency, streak, and strength mechanics

- `id`: SERIAL PRIMARY KEY
  - Unique quest identifier
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - Owner of the quest
- `name`: VARCHAR(200) NOT NULL
  - Quest name (max 200 chars)
- `description`: TEXT
  - Optional quest description
- `created_at`: TIMESTAMP DEFAULT NOW()
  - Creation timestamp
- `is_completed`: BOOLEAN DEFAULT FALSE
  - Completion status
- `frequency`: INT DEFAULT 1 CHECK (frequency >= 0)
  - Interval in days between required completions (1 = daily, 7 = weekly, etc.)
- `rest_frequency`: INT DEFAULT 0 CHECK (rest_frequency >= 0)
  - Allowed rest days without streak reset
- `last_rest_date`: DATE
  - Date of last rest day
- `experience_share`: INT NOT NULL CHECK (experience_share BETWEEN 0 AND 100)
  - Percentage share (0–100) of daily experience points allocated to this quest based on user-defined priority or difficulty
- `streak`: INT DEFAULT 0
  - Current streak count
- `strength_points`: INT DEFAULT 0
  - Accumulated strength points
- `strength_level`: strength_rank REFERENCES strength_levels(level) DEFAULT 'E'
  - Current strength rank (E-S)
- `last_completed_date`: DATE
  - Date of last completion
- `position`: INT NOT NULL CHECK (position >= 0)
  - Display order for quest list (unique per user)
  - Position is zero-indexed and handled before insertion
- `updated_at`: TIMESTAMP DEFAULT NOW()
  - Timestamp of last update
- UNIQUE (user_id, position)
  - Ensures each user has unique quest ordering
- UNIQUE (user_id, name)
  - Ensures quest names are unique per user

**quest_completions**: Records each quest completion with streak and experience earned

- `id`: SERIAL PRIMARY KEY
  - Unique completion record identifier
- `quest_id`: INT REFERENCES quests(id) ON DELETE CASCADE
  - Reference to completed quest
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
- `quest_id`: INT REFERENCES quests(id) ON DELETE SET NULL
  - Related quest (nullable)
- `experience_amount`: DECIMAL(8, 2) NOT NULL
  - Experience points in transaction
- `reason`: TEXT
  - Description of transaction
- `created_at`: TIMESTAMP DEFAULT NOW()
  - Transaction timestamp

**quests_attributes**: Junction table linking quests to attributes with power multipliers

- `id`: SERIAL PRIMARY KEY
  - Unique junction record identifier
- `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
  - Owner of the quest-attribute relationship
- `quest_id`: INT REFERENCES quests(id) ON DELETE CASCADE
  - Reference to quest
- `attribute_id`: INT REFERENCES attributes(id) ON DELETE CASCADE
  - Reference to attribute
- `attribute_power`: INT DEFAULT 1
  - Power multiplier for this attribute
- `updated_at`: TIMESTAMP DEFAULT NOW()
  - Timestamp of last update
- UNIQUE (quest_id, attribute_id)
  - Ensures each quest-attribute pair is unique

### Key Features

- Strength rank system (E-S) applies experience multipliers to quest rewards
- Frequency and rest_frequency fields support flexible habit scheduling
- Experience shared across user level, individual attributes, and quest streaks
- Cascading deletes maintain referential integrity when users or quests are removed
- Trigger upon insertion to Supabase auth.users that inserts user to project users table
- Function to create user profile with attributes and quests in single atomic transaction

### Strength Levels Reference (from setup)

INSERT INTO strength_levels (level, multiplier) VALUES
('E', 0),
('D', 0.20),
('C', 0.40),
('B', 0.60),
('A', 0.80),
('S', 1.00);

### Indexes Reference

CREATE INDEX idx_attributes_user_id ON attributes(user_id);
CREATE INDEX idx_quests_user_id ON quests(user_id);
CREATE INDEX idx_quest_completions_quest_id ON quest_completions(quest_id);
CREATE INDEX idx_experience_log_user_id ON experience_log(user_id);
CREATE INDEX idx_quests_attributes_user_id ON quests_attributes(user_id);
CREATE INDEX idx_quest_completions_completed_at ON quest_completions(completed_at);
CREATE INDEX idx_experience_log_quest_id ON experience_log(quest_id);
CREATE INDEX idx_users_usertag ON users (usertag);
CREATE INDEX idx_quests_attributes_quest_id ON quests_attributes (quest_id);
CREATE INDEX idx_quests_attributes_attribute_id ON quests_attributes (attribute_id);

### Functions and Triggers Reference

#### Handle New User Signup (Trigger)

```sql
-- Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS
$$
BEGIN
  INSERT INTO public.users (id, email, username, usertag)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'username', NEW.raw_user_meta_data ->> 'usertag');
  RETURN NEW;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Trigger
CREATE TRIGGER after_user_signup_create_user
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();
```

#### Atomic Profile Creation Function

##### Example Call

```typescript
// Prepare data for insertion
const attributesData: CreateProfileTransactionAttributes[] =
  validatedAttributes.map((attribute) => ({
    name: attribute.name,
    position: attribute.order,
  }));

const questsData: CreateProfileTransactionQuests[] = [];
const questsAttributesData: CreateProfileTransactionQuestsAttributes[] = [];
for (const quest of validatedQuests) {
  questsData.push({
    name: quest.name,
    experience_share: quest.experiencePointValue,
    position: quest.order,
  });
  for (const affectedAttribute of quest.affectedAttributes) {
    const attributePower = strengthToIntMap[affectedAttribute.strength];
    if (attributePower === undefined) {
      return {
        message: `Invalid strength value: ${affectedAttribute.strength}`,
      };
    }
    // Duplicate names are restricted by DB constraints and validation schema
    questsAttributesData.push({
      quest_name: quest.name,
      attribute_name: affectedAttribute.name,
      attribute_power: attributePower,
    });
  }
}

// Insert data into the database within a transaction
const { error } = await supabase.rpc("create_profile_transaction", {
  p_user_id: validatedUserId,
  p_attributes: attributesData,
  p_quests: questsData,
  p_quests_attributes: questsAttributesData,
});
```

#### Function Definition

-- Define function that takes user_id, array of attribute objects,
-- array of quest objects, and array of quests_attributes
-- for insertion into respective tables in single atomic transaction.
-- Conflicting names or positions should be handled before calling this function.
-- Existing records should not be an issue (this is intended for new users),
-- but is handled just in case.
-- Descriptions are not handled here but can be added once their support is added.
-- Uses SECURITY DEFINER to ensure proper permissioning.

```sql
CREATE OR REPLACE FUNCTION create_profile_transaction(
  p_user_id UUID,
  p_attributes JSONB,
  p_quests JSONB,
  p_quests_attributes JSONB
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- SECURITY CHECK: Ensure the authenticated user can only modify their own data
  IF p_user_id IS NULL OR p_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: User ID mismatch' USING ERRCODE = '42501';
  END IF;

  -- Validate inputs are not NULL
  IF p_attributes IS NULL OR p_quests IS NULL OR p_quests_attributes IS NULL THEN
    RAISE EXCEPTION 'Input parameters cannot be NULL';
  END IF;

  WITH
  -- Parse and deduplicate attribute inputs
  attr_input AS (
    SELECT DISTINCT name, position
    FROM jsonb_to_recordset(p_attributes) AS x(name text, position int)
  ),

  -- Insert attributes and handle existing ones
  inserted_attrs AS (
    INSERT INTO attributes (user_id, name, position)
    SELECT p_user_id, name, position FROM attr_input
    ON CONFLICT (user_id, name) DO UPDATE SET position = EXCLUDED.position
    RETURNING id, name
  ),

  -- Parse and deduplicate quest inputs
  quest_input AS (
    SELECT DISTINCT name, experience_share, position
    FROM jsonb_to_recordset(p_quests) AS x(name text, experience_share int, position int)
  ),

  -- Insert quests and handle existing ones
  inserted_quests AS (
    INSERT INTO quests (user_id, name, experience_share, position)
    SELECT p_user_id, name, experience_share, position FROM quest_input
    ON CONFLICT (user_id, name) DO UPDATE SET position = EXCLUDED.position
    RETURNING id, name
  ),

  -- Final insert into junction table using results from above CTEs
  final_insert AS (
    INSERT INTO quests_attributes (user_id, quest_id, attribute_id, attribute_power)
    SELECT
      p_user_id,
      iq.id,
      ia.id,
      qa.attribute_power
    FROM jsonb_to_recordset(p_quests_attributes) AS qa(quest_name text, attribute_name text, attribute_power int)
    JOIN inserted_quests iq ON qa.quest_name = iq.name
    JOIN inserted_attrs ia ON qa.attribute_name = ia.name
    ON CONFLICT (quest_id, attribute_id) DO UPDATE SET attribute_power = EXCLUDED.attribute_power
    RETURNING quest_id
  ),

  -- Mark profile as complete
  update_profile AS (
    UPDATE users
    SET profile_complete = TRUE, updated_at = NOW()
    WHERE id = p_user_id
  )

  -- Build the response with the newly created IDs
  SELECT jsonb_build_object(
    'success', true,
    'attribute_ids', (SELECT jsonb_agg(id) FROM inserted_attrs),
    'quest_ids', (SELECT jsonb_agg(id) FROM inserted_quests),
    'junction_records_inserted', (SELECT count(*) FROM final_insert)
  ) INTO v_result;

  RETURN v_result;

EXCEPTION
  WHEN OTHERS THEN
    -- Re-raise with a custom message while preserving the internal SQLSTATE
    RAISE EXCEPTION 'Transaction failed: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$;
```

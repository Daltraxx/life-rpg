CREATE TABLE progression_log (
  id SERIAL PRIMARY KEY,
  target TEXT NOT NULL CHECK (target IN ('user', 'quest_strength', 'attribute')),
  reason TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id INTEGER REFERENCES quests(id) ON DELETE SET NULL,
  quest_name TEXT,
  attribute_id INTEGER REFERENCES attributes(id) ON DELETE SET NULL,
  attribute_name TEXT,
  points INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
  (quest_id IS NULL OR quest_name IS NOT NULL)
  AND
  (attribute_id IS NULL OR attribute_name IS NOT NULL)
);
)

CREATE INDEX idx_progression_log_user_id
ON progression_log (user_id);

CREATE INDEX idx_progression_log_created_at
ON progression_log (created_at);

CREATE INDEX idx_progression_log_user_created_at
ON progression_log (user_id, created_at);
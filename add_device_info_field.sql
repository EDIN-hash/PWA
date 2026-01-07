-- Add deviceInfo field to track detailed device information
ALTER TABLE items ADD COLUMN deviceInfo VARCHAR(255) DEFAULT '';

-- Update existing records to have empty deviceInfo (will be populated on next edit)
UPDATE items SET deviceInfo = '' WHERE deviceInfo IS NULL;

-- Also ensure deviceId field exists (should already exist from previous schema)
-- If not, this will add it:
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'items' 
        AND column_name = 'deviceid'
    ) THEN
        ALTER TABLE items ADD COLUMN deviceId VARCHAR(50) DEFAULT 'Unknown';
    END IF;
END $$;
-- Add deviceId column to items table (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'items' 
        AND column_name = 'deviceid'
    ) THEN
        ALTER TABLE items ADD COLUMN deviceId VARCHAR(50) DEFAULT 'Unknown';
        RAISE NOTICE 'Added deviceId column to items table';
    ELSE
        RAISE NOTICE 'deviceId column already exists in items table';
    END IF;
END $$;

-- Update existing records to have proper deviceId if null
UPDATE items SET deviceId = 'Unknown' WHERE deviceId IS NULL OR deviceId = '';

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'items' 
ORDER BY ordinal_position;
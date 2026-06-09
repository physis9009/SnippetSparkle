import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function ensureColumnExists() {
  await sql`ALTER TABLE snippets ADD COLUMN IF NOT EXISTS star_count INT`;
}

async function syncHistoricalData() {
  await sql`
    UPDATE snippets s 
    SET star_count = (
        SELECT COUNT(*)::INT
        FROM user_starred_snippets us 
        WHERE us.snippet_id = s.id
    )
    WHERE star_count IS NULL OR star_count != (
        SELECT COUNT(*)::INT
        FROM user_starred_snippets us 
        WHERE us.snippet_id = s.id
    )
  `;
}

async function setColumnConstraints() {
  await sql`ALTER TABLE snippets ALTER COLUMN star_count SET NOT NULL`;
  await sql`ALTER TABLE snippets ALTER COLUMN star_count SET DEFAULT 0`;
}

async function createTriggerFunctions() {
  await sql`
    CREATE OR REPLACE FUNCTION increment_star_count()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE snippets 
      SET star_count = star_count + 1 
      WHERE id = NEW.snippet_id;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `;

  await sql`
    CREATE OR REPLACE FUNCTION decrement_star_count()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE snippets 
      SET star_count = star_count - 1 
      WHERE id = OLD.snippet_id;
      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql
  `;
}

async function createTriggers() {
  await sql`DROP TRIGGER IF EXISTS trg_star_insert ON user_starred_snippets`;
  await sql`
    CREATE TRIGGER trg_star_insert
    AFTER INSERT ON user_starred_snippets
    FOR EACH ROW EXECUTE FUNCTION increment_star_count()
  `;

  await sql`DROP TRIGGER IF EXISTS trg_star_delete ON user_starred_snippets`;
  await sql`
    CREATE TRIGGER trg_star_delete
    AFTER DELETE ON user_starred_snippets
    FOR EACH ROW EXECUTE FUNCTION decrement_star_count()
  `;
}

export async function GET() {
  try {
      await sql.begin(async () => {
        await ensureColumnExists();
        await syncHistoricalData();
        await setColumnConstraints();
        await createTriggerFunctions();
        await createTriggers();
      });

    return Response.json({ 
      message: 'Successfully added star_count column, synced historical data, and set up database triggers.' 
    });
  } catch (error) {
    console.error('Failed to setup star_count:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
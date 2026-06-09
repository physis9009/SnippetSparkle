import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function addIndex() {
    await sql`CREATE INDEX IF NOT EXISTS idx_on_createtime ON snippets (created_at DESC)`;
}

export async function GET() {
    try {
        await addIndex();

        return Response.json({message: 'migration successes.'});
    } catch (error) {
        console.error('migration failed.')
        return Response.json({ error: String(error) }, { status: 500 });
    }
}
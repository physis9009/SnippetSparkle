import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function joinTables() {
  await sql`
    CREATE TABLE user_starred_snippets (
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      snippet_id UUID REFERENCES snippets(id) ON DELETE CASCADE,
      starred_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (user_id, snippet_id)
    )
  `;
}

export async function GET() {
    try {
        await joinTables();

        return Response.json({message: 'join tables successfully.'});
    } catch (error) {
        console.error('failed to join tables.')
        return Response.json({ error: String(error) }, { status: 500 });
    }
}
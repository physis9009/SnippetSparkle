import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function alterEmail() {
    await sql`
        ALTER TABLE users
        ADD CONSTRAINT unique_email UNIQUE (email)
    `;
}

export async function GET() {
    try {
        await alterEmail();

        return Response.json({message: 'migration successes.'});
    } catch (error) {
        console.error('migration failed.')
        return Response.json({ error: String(error) }, { status: 500 });
    }
}
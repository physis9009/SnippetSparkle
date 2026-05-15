import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

async function pythonSnippets() {
    const data = await sql`
        SELECT snippets.code
        FROM snippets
        WHERE snippets.language = 'Python';
    `;

    return data;
}

export async function GET() {
    try {
        return Response.json(await pythonSnippets());
    } catch (error) {
        return Response.json({error}, {status: 500});
    }
}
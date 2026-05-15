import postgres from "postgres";
import {Snippet, Tag} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, {ssl: 'require'});

export async function fetchSnippets() {
    try {
        console.log("Fetching snippets...")

        const snippets = await sql<Snippet[]>`
            SELECT * FROM snippets;
        `;

        console.log("Completed fetching snippets.")

        return snippets;
    } catch (error) {
        console.error("Error fetching snippets: ", error);
        throw new Error('Failed to fetch snippets.');
    }
}
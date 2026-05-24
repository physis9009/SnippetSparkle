'use server';

import {z} from 'zod';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({

});

const CreatSnippet = FormSchema.omit({});

export async function creatSnippet(formData: FormData) {

}
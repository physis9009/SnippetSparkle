'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { toTagKey } from './utils';
import {auth, signIn, signOut} from '@/auth';
import { AuthError } from 'next-auth';
import {revalidateTag, revalidatePath} from 'next/cache';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1, 'Cannot be only spaces').optional(),
  language: z.string().min(1, "Language is required"),
  summary: z.string().trim().min(1, 'Cannot be only spaces').optional(),
  code: z.string().min(1, "Code is required"),
  tags: z.array(z.string()).max(8, 'Maximum 8 tags').optional(),
  created_at: z.iso.datetime(),
  created_by: z.uuid(),
});

const SnippetCreateSchema = FormSchema.omit({ id: true, created_at: true, created_by: true, });

export async function creatSnippet(formData: FormData) {
  const session = await auth();
  const userId = session!.user!.id!;

  const newTagDisplay = formData.get('new_tag') as string | null;
  
  const validated = SnippetCreateSchema.safeParse({
    language: formData.get('language'),
    title: formData.get('title'),
    code: formData.get('code'),
    summary: formData.get('summary'),
    tags: formData.getAll('tags'),
  });

  if (!validated.success) {
    throw new Error('Validation failed');
  }

  const { language, title, code, summary, tags = [] } = validated.data;

  if (newTagDisplay && newTagDisplay.trim()) {
    const newTagName = toTagKey(newTagDisplay.trim());
    const displayName = newTagDisplay.trim();
    
    if (!tags.includes(newTagName)) {
        await sql`
            INSERT INTO tags (name, display_name)
            VALUES (${newTagName}, ${displayName})
            ON CONFLICT (name) DO NOTHING
        `;
        
        tags.push(newTagName);
    }
  }

  if (tags.length > 0) {
    const existingTags = await sql<{ name: string }[]>`SELECT name FROM tags`;
    const existingNames = new Set(existingTags.map(t => t.name));
    const missing = tags.filter(name => !existingNames.has(name));
    
    for (const name of missing) {
      const displayName = name.split('-').map(w => 
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ');
      await sql`
        INSERT INTO tags (name, display_name)
        VALUES (${name}, ${displayName})
        ON CONFLICT (name) DO NOTHING
      `;
    }
  }

  await sql`
    INSERT INTO snippets (title, language, summary, code, tags, created_at, created_by)
    VALUES (
      ${title ?? null},
      ${language},
      ${summary ?? null},
      ${code},
      ${tags.length > 0 ? tags : null}::text[],
      NOW(),
      ${userId}
    )
  `;
}

export async function toggleStar(snippetId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Need to log in to star a snippet.");
  }

  const userId = session.user.id;
  const existing = await sql`
    SELECT 1 FROM user_starred_snippets WHERE user_id = ${userId} AND snippet_id = ${snippetId}
  `;
  if (existing.length === 0) {
    await sql`
      INSERT INTO user_starred_snippets (user_id, snippet_id)
      VALUES (${userId}, ${snippetId})
    `;
  } else {
    await sql`
      DELETE FROM user_starred_snippets WHERE user_id = ${userId} AND snippet_id = ${snippetId}
    `;
  }

  revalidateTag(`star-count-${snippetId}`, 'max')
}

export async function starSnippet(userId: string, snippetId: string) {
  try {
    await sql`
      INSERT INTO user_starred_snippets (user_id, snippet_id) VALUES (${userId}, ${snippetId})
    `;
    console.log("Star snippet successfully.")
  } catch (error) {
    console.error("Failed to star this snippet: ", error);
    throw new Error("Failed to star this snippet.");
  }
}

export async function unStarSnippet(userId: string, snippetId: string) {
  try {
    await sql`
      DELETE FROM user_starred_snippets WHERE user_id = ${userId} AND snippet_id = ${snippetId}
    `;
    console.log("Unstar snippet successfully.")
  } catch (error) {
    console.error("Failed to unstar this snippet: ", error);
    throw new Error("Failed to unstar this snippet.");
  }
}

export interface AuthState {
  success: boolean;
  callbackUrl?: string;
  message?: string;
}

export async function authenticate(prevState: AuthState | undefined, formData: FormData) {
  const callbackUrl = formData.get("callbackUrl") as string || "/";
  
  const result = await signIn('credentials', {
    email: formData.get('email'),
    password: formData.get('password'),
    redirect: false,
  });

  if (result?.error) {
    return { success: false, message: 'Invalid Credentials.' };
  }

  return { success: true, callbackUrl };
}

export async function signOutAction() {
  await signOut();
}

export async function checkIfStarred(snippetId: string, userId: string): Promise<boolean> {
  const result = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM user_starred_snippets
      WHERE user_id = ${userId} AND snippet_id = ${snippetId}
    ) AS is_starred
  `;

  return result[0]?.is_starred ? true : false;
}

const UserSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, 'Username is required').max(30, 'Username must be at most 30 characters'),
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters").max(50, 'Password must be at most 50 characters'),
});

const UserCreateSchema = UserSchema.omit({id: true,});

export interface SignUpState {
  success: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
}

export async function createUser(prevState: SignUpState, formData: FormData) {
  const validatedNewUser = UserCreateSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedNewUser.success) {
    return {
      success: false,
      errors: validatedNewUser.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to create user.'
    };
  }

  const {name, email, password} = validatedNewUser.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const pgError = error as PostgresError;
      if (pgError.code === '23505') {
        return { success: false, message: 'Email already exists. Please use a different email.' };
      }
    }
    return { success: false, message: 'Database Error: Failed to create user.' };
  }

  const result = await signIn('credentials', { email, password, redirect: false });

  if (result?.error) {
    return { success: false, message: 'Account created, but auto-login failed. Please sign in manually.' };
  }

  return {success: true};
}
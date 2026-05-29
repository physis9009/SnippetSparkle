'use client';

import { useActionState } from "react";
import { authenticate } from "../lib/actions";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    return (
        <form action={formAction}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <label htmlFor="username">Username: </label>
            <input id="username" type='text' name="name"></input>
            <label htmlFor="email">Email: </label>
            <input id="email" type="email" name="email"></input>
            <label htmlFor="password">Password: </label>
            <input id="password" type="password" name="password"/>
            <button type="submit">Log in</button>
        </form>
    );
}
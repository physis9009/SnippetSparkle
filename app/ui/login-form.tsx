'use client';

import { useActionState } from "react";
import { authenticate } from "../lib/actions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    return (
        <form action={formAction} className="
            bg-wht-gr text-blk-gr w-[40%] h-[50%] flex flex-col justify-start content-center items-center
            rounded-md p-4 border-2 border-blk
        ">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div>
                <label htmlFor="email">Email: </label>
                <input id="email" type="email" name="email" className="border border-blk-gr rounded-sm my-2 bg-wht-md hover:bg-wht"></input>
            </div>

            <div>
                <label htmlFor="password">Password: </label>
                <input id="password" type="password" name="password" className="border border-blk-gr rounded-sm my-2 bg-wht-md hover:bg-wht"/>
            </div>
            
            
            <button type="submit" className="
                hover:cursor-pointer border border-wht rounded-sm text-wht-md hover:text-wht
                bg-grn-gr hover:bg-grn px-2 italic my-2 font-semibold text-lg hover:shadow shadow-blk-gr
            ">Sign in</button>
            <span className="my-2 text-sm border-t border-t-blk-gr pt-4">Don&#39;t have an account? <Link href='/sign-up' className="
                italic font-semibold text-grn-gr hover:text-grn bg-wht-md hover:bg-wht rounded-sm px-2 hover:shadow shadow-blk-gr
                border border-grn-gr hover:border-grn text-lg
            ">Sign up</Link></span>
            
            <span className="my-2 text-sm">or <Link href='/' className="
                italic font-semibold text-grn-gr hover:text-grn bg-wht-md hover:bg-wht rounded-sm px-2
                border border-grn-gr hover:border-grn text-lg hover:shadow shadow-blk-gr
            ">Continue</Link> without signing in</span>
        </form>
    );
}
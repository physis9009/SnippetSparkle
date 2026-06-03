'use client';

import { useActionState, useEffect } from "react";
import { authenticate } from "../lib/actions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MorphingInfinity } from "@/components/morphing-infinity";
import { useSession } from "next-auth/react";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [authState, formAction, isPending] = useActionState(authenticate, undefined);
    const {update} = useSession();

    useEffect(() => {
        if (authState && authState.success) {
            update().then(() => {
                window.location.href = '/';
            });
            
        }
    }, [authState]);

    return (
        <form action={formAction} className="
            bg-wht-gr text-blk-gr w-[40%] h-[60%] flex flex-col justify-start content-center items-center
            rounded-md p-4 border-2 border-blk
        ">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div className="h-[15%]">
                <label htmlFor="email">Email: </label>
                <input id="email" type="email" name="email" className="border border-blk-gr rounded-sm my-2 bg-wht-md hover:bg-wht"></input>
            </div>

            <div className="h-[15%]">
                <label htmlFor="password">Password: </label>
                <input id="password" type="password" name="password" className="border border-blk-gr rounded-sm my-2 bg-wht-md hover:bg-wht"/>
            </div>
            
            {isPending
                ? <MorphingInfinity className="size-10 mt-1" />
                : <button type="submit" className="
                    hover:cursor-pointer border border-wht rounded-sm text-wht-md hover:text-wht
                    bg-grn-gr hover:bg-grn px-2 italic my-2 font-semibold text-lg hover:shadow shadow-blk-gr
                  ">Sign in</button>
            }
            {!authState?.success && authState?.message && <div className="text-pnk text-xs">{authState.message}</div>}

            <span className="mb-2 mt-4 text-sm border-t border-t-blk-gr pt-4">Don&#39;t have an account? <Link href='/sign-up' className="
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
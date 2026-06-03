'use client';

import { useActionState } from "react";
import { createUser, type State } from "../lib/actions";
import Link from "next/link";
import { MorphingInfinity } from "@/components/morphing-infinity";

export function SignUpForm() {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction, isPending] = useActionState(createUser, initialState);

    return (
        <form action={formAction} className="
            bg-wht-gr text-blk-gr w-[40%] h-[70%] flex flex-col justify-start content-center items-center
            rounded-md p-4 border-2 border-blk
        ">
            <div className="h-[15%]">
                <label htmlFor="name">Username: </label>
                <input 
                    id="name" type="text" name="name" 
                    className="border border-blk-gr rounded-sm my-2 bg-wht-md hover:bg-wht"
                    aria-describedby="name-error"
                ></input>
                <div id='name-error' aria-live="polite" aria-atomic='true'>
                    {state.errors?.name && 
                        state.errors.name.map(error => (
                            <p key={error} className="text-pnk text-xs">{error}</p>
                        ))
                    }
                </div>
            </div>

            <div className="h-[15%]">
                <label htmlFor="email">Email: </label>
                <input 
                    id="email" type="email" name="email" 
                    className="border border-blk-gr rounded-sm my-2 bg-wht-md hover:bg-wht"
                    aria-describedby="email-error"
                ></input>
                <div id='email-error' aria-live='polite' aria-atomic='true'>
                    {state.errors?.email && 
                        state.errors.email.map(error => (
                            <p key={error} className="text-pnk text-xs">{error}</p>
                        ))
                    }
                </div>
            </div>

            <div className="h-[15%]">
                <label htmlFor="password">Password: </label>
                <input 
                    id="password" type="password" name="password" 
                    className="border border-blk-gr rounded-sm my-2 bg-wht-md hover:bg-wht"
                    aria-describedby="password-error"
                />
                <div id='password-error' aria-live='polite' aria-atomic='true'>
                    {state.errors?.password && 
                        state.errors.password.map(error => (
                            <p key={error} className="text-pnk text-xs">{error}</p>
                        ))
                    }
                </div>
            </div>
            
            {isPending
                ? <MorphingInfinity className="size-10 mt-1" />
                : <button type="submit" className="
                        hover:cursor-pointer border border-wht rounded-sm text-wht-md hover:text-wht
                      bg-grn-gr hover:bg-grn px-2 italic my-2 font-semibold text-lg hover:shadow shadow-blk-gr
                  ">Sign up</button>
            }
            
            <span className="my-2 text-sm border-t border-t-blk-gr pt-4">Already have an account? <Link href='/login' className="
                italic font-semibold text-grn-gr hover:text-grn bg-wht-md hover:bg-wht rounded-sm px-2
                border border-grn-gr hover:border-grn text-lg hover:shadow shadow-blk-gr
            ">Sign in</Link></span>
            
            <span className="my-2 text-sm">or <Link href='/' className="
                italic font-semibold text-grn-gr hover:text-grn bg-wht-md hover:bg-wht rounded-sm px-2
                border border-grn-gr hover:border-grn text-lg hover:shadow shadow-blk-gr
            ">Continue</Link> without signing in</span>
        </form>
    );
}
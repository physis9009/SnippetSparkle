'use client';
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { signInAction,  signOutAction } from "../lib/actions";

export default function Page() {
    const pathname = usePathname();
    const {data: session, status} = useSession();
    const hasUser = status === 'authenticated' && session?.user?.id;

    const links = [
        {name: "Home", href: "/"},
        {name: "Starred", href: hasUser ? `/${session.user!.id}/starred` : "/login"},
        {name: "My Shares", href: hasUser ? `/${session.user!.id}/my-shares` : "/login"},
        {name: "New", href: hasUser ? `/${session.user!.id}/new` : "/login"}
    ];

    let authButton = null;
    if (status === 'loading') {
        authButton = <span>Loading...</span>;
    } else if (session) {
        authButton = <form action={signOutAction} className="w-[90%] rounded-sm sm:pt-2 sm:pb-2 text-center hover:text-wht hover:bg-blk-gr hover:cursor-pointer
        text-sm italic"><button type="submit" className="w-full  hover:cursor-pointer">Sign Out</button></form>;
    } else {
        authButton = (
            <div className="flex flex-row gap-1">
                <form action={signInAction} className="w-[90%] rounded-sm sm:pt-2 sm:pb-2 text-center hover:text-wht hover:bg-blk-gr hover:cursor-pointer
                text-sm italic"><button type="submit" className="w-full hover:cursor-pointer">SignUp/SignIn</button></form>
            </div>
        );
    }

    return (
        <>
            {links.map((link) => (
                <Link key={link.name} href={link.href}
                className={clsx(
                    "w-[90%] rounded-sm sm:pt-2 sm:pb-2 text-center border-b-1 border-b-[#5a5a5a]", 
                    [pathname === link.href && 'bg-blk text-[#5a5a5a] cursor-default italic pointer-events-none'], 
                    [pathname !== link.href && 'hover:text-wht hover:bg-blk-gr']
                )}>
                    {link.name}
                </Link>
            ))}
            {authButton}
        </>
        
    );
}
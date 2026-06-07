'use client';
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { signOutAction } from "../lib/actions";
import {animate, scrambleText, JSAnimation} from "animejs";
import { useRef } from "react";

export default function Page() {
    const pathname = usePathname();
    const {data: session, status} = useSession();
    const hasUser = status === 'authenticated' && session?.user?.id;
    const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
    const animationRefs = useRef<Record<string, JSAnimation | null>>({});

    const links = [
        {name: "Home", href: "/"},
        {name: "Starred", href: hasUser ? `/${session.user!.id}/starred` : "/login"},
        {name: "My Shares", href: hasUser ? `/${session.user!.id}/my-shares` : "/login"},
        {name: "New", href: hasUser ? `/${session.user!.id}/new` : "/login"}
    ];

    
    const handleMouseEnter = (linkName: string, href: string) => {
        const element = linkRefs.current[linkName];
        
        if (element && pathname !== href) {
            if (animationRefs.current[linkName]) {
                animationRefs.current[linkName].revert();
                element.textContent = linkName;
            }
            const anm = animate(element, {
                innerHTML: scrambleText({
                    text: element.textContent,
                }),
                loop: false,
                loopDelay: 200,
            });
            animationRefs.current[linkName] = anm;
        }
    };

    const handleMouseLeave = (linkName: string, href: string) => {
        if (!animationRefs.current) return;
        const element = linkRefs.current[linkName];
        const anm = animationRefs.current[linkName];
        if (anm) {
            anm.revert();            
            if (element && pathname !== href) {
                element.textContent = linkName;  
            }
        }
    };

    let authButton = null;
    if (status === 'loading') {
        authButton = <div className="sm:w-[80%] rounded-sm bg-[#5a5a5a] animate-pulse">
            <span className="invisible">Sign Out</span>
        </div>;
    } else if (session) {
        authButton = <form action={signOutAction} className="w-[90%] rounded-sm sm:pt-2 sm:pb-2 text-center hover:text-wht hover:bg-blk-gr hover:cursor-pointer
        text-sm italic"><button type="submit" className="w-full  hover:cursor-pointer">Sign Out</button></form>;
    } else {
        authButton = (
            <div className="flex flex-row gap-1">
                <Link href='/login' className="w-[90%] rounded-sm sm:pt-2 sm:pb-2 text-center hover:text-wht hover:bg-blk-gr hover:cursor-pointer
                text-sm italic">SignUp/SignIn</Link>
            </div>
        );
    }

    return (
        <>
            {links.map((link) => (
                <Link key={link.name} href={link.href} 
                onMouseEnter={() => handleMouseEnter(link.name, link.href)}
                onMouseLeave={() => handleMouseLeave(link.name, link.href)}
                ref={(el) => { linkRefs.current[link.name] = el; }}
                className={clsx(
                    `${link.name.toLowerCase()}-link w-[90%] rounded-sm sm:pt-2 sm:pb-2 text-center border-b-1 border-b-[#5a5a5a]`, 
                    [pathname === link.href && 'bg-blk text-[#5a5a5a] cursor-default italic pointer-events-none'], 
                    [pathname !== link.href && 'hover:text-wht hover:bg-blk-gr']
                )}>
                    {link.name}
                </Link>
            ))}
            {}
            {authButton}
        </>
        
    );
}
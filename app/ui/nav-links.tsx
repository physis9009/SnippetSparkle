'use client';
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

const links = [
    {name: "Home", href: "/"},
    {name: "Favorite", href: "/favorite"},
    {name: "New", href: "/new"}
];

export default function Page() {
    const pathname = usePathname();

    return (
        <>
            {links.map((link) => (
                <Link key={link.name} href={link.href}
                className={clsx(
                    "w-[90%] rounded-sm sm:pt-2 sm:pb-2 text-center", 
                    [pathname === link.href && 'bg-blk text-[#5a5a5a] cursor-default italic pointer-events-none'], 
                    [pathname !== link.href && 'hover:text-wht hover:bg-blk-gr hover:font-semibold']
                )}>
                    {link.name}
                </Link>
            ))}
        </>
    );
}
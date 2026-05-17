'use client';
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

const links = [
    {name: "Home", href: "/"},
    {name: "Favorite", href: "/favorite"},
    {name: "Add", href: "/add"}
];

export default function Page() {
    const pathname = usePathname();

    return (
        <>
            {links.map((link) => (
                <Link key={pathname === link.href ? undefined : link.name} href={link.href}
                className={clsx(
                    "w-[90%] rounded-sm sm:pt-2 sm:pb-2 text-center", 
                    [pathname === link.href && 'bg-blk text-wht-gr cursor-default italic'], 
                    [pathname !== link.href && 'hover:text-wht hover:bg-blk-gr hover:font-bold']
                )}>
                    {link.name}
                </Link>
            ))}
        </>
    );
}
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
                <Link key={link.name} href={link.href}
                className={clsx(pathname === link.href && 'bg-blk text-wht-gr')}>
                    {link.name}
                </Link>
            ))}
        </>
    );
}
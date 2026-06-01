'use client';

import { Share_Tech } from "next/font/google";
import Image from "next/image";
import { SessionProvider } from "next-auth/react";
import dynamic from 'next/dynamic';

const shareTech = Share_Tech({
    weight: '400',
    style: 'normal',
    subsets: ['latin'],
});

const ClientNavLinks = dynamic(
        () => import('./nav-links'),
        {ssr: false},
    );

export default function Navigation() {
    return (
        <SessionProvider>
            <nav className={`
                ${shareTech.className} text-xl shrink-0 border-b-2 sm:border-r-4 border-blk-gr
                w-full max-h-10 bg-blk-md sm:h-full sm:max-w-25 sm:max-h-none
                flex flex-row sm:flex-col justify-start items-center gap-4
            `}>
                <Image src='/Cameroceras.svg' width={30} height={30} alt="Logo of Cameroceras" className="rounded-md sm:w-full" loading="eager"/>
                <ClientNavLinks />
            </nav>
        </SessionProvider>
    );
}
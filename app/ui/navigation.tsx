'use client';

import { Share_Tech } from "next/font/google";
import Image from "next/image";
import { SessionProvider } from "next-auth/react";
import dynamic from 'next/dynamic';
import { IconBackground } from "./icon-background";

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
                w-full max-h-20 bg-blk-md sm:h-full sm:max-w-30 sm:max-h-none
                flex flex-row sm:flex-col justify-start items-center gap-4
            `}>
                <div className="rounded-sm w-[10vw] h-full sm:w-full sm:h-[10vh] relative shrink-0 sm:mb-3 sm:mt-2">
                    <IconBackground />
                    <div className="absolute inset-0 sm:top-1 sm:left-0 z-10 flex items-center justify-center">
                        <Image 
                            src='/Cameroceras.svg' 
                            width={30} 
                            height={30} 
                            alt="Logo of Cameroceras" 
                            className="rounded-md sm:w-full"
                            loading="eager"
                        />
                    </div>
                </div>
                <ClientNavLinks />
            </nav>
        </SessionProvider>
    );
}
import { Noto_Sans } from "next/font/google";
import Link from "next/link";
import NavLinks from "./nav-links"

const notoSans = Noto_Sans({weight: "400", style: "normal", subsets: ["latin"]});

export default function Navigation() {
    return (
        <nav className={`
            ${notoSans.className} text-xl flex-1 border border-blk-gr 
            w-full max-h-15 bg-blk-gr sm:h-full sm:max-w-30 sm:max-h-none
            flex flex-row sm:flex-col justify-evenly items-center
        `}>
            <NavLinks />
        </nav>
    );
}
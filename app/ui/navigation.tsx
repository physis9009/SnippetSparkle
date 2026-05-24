import { Noto_Sans } from "next/font/google";
import NavLinks from "./nav-links"
import Image from "next/image";

const notoSans = Noto_Sans({weight: "400", style: "normal", subsets: ["latin"]});

export default function Navigation() {
    return (
        <nav className={`
            ${notoSans.className} text-xl shrink-0 border-b-2 sm:border-r-4 border-blk-gr
            w-full max-h-10 bg-blk-md sm:h-full sm:max-w-25 sm:max-h-none
            flex flex-row sm:flex-col justify-start items-center gap-4
        `}>
            <Image src='/Cameroceras.svg' width={30} height={30} alt="Logo of Cameroceras" className="rounded-md sm:w-full"/>
            <NavLinks />
        </nav>
    );
}
import { Noto_Sans } from "next/font/google";

const notoSans = Noto_Sans({weight: "400", style: "normal", subsets: ["latin"]});

export default function Navigation() {
    return (
        <nav className={`${notoSans.className} text-xl flex-1 border border-blk-gr w-full max-h-15 bg-blk-gr sm:h-full sm:max-w-30 sm:max-h-none`}>
            <ul className="flex flex-row sm:flex-col justify-evenly items-center h-full w-full">
                <li>Home</li>
                <li>Saved</li>
                <li>Add</li>
                <li>Filter</li>
            </ul>
        </nav>
    );
}
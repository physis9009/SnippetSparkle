import Link from "next/link";

export default function Footer() {
    return <footer className="w-full bg-blk-gr mt-6 grid grid-cols-3 gap-4 justify-items-center text-[#d9d4c8] text-xs">
        <div className="grid grid-cols-1 p-4">
            <h3 className="border-l-pnk-gr border-l-2 h-6 px-2 text-sm">SnippetSparkle</h3>
            <p className="px-2">A collaborative, searchable hub for sharable code snippets and notes.</p>
        </div>

        <div className="grid grid-cols-1 p-4">
            <h4 className="border-l-pnk-gr border-l-2 h-6 px-2 text-sm mb-2">Contact & Support</h4>
            <ul className="px-4 gird grid-cols-1 gap-y-6">
                <li><Link href="https://github.com/physis9009/PMP" className="italic text-grn-gr hover:text-grn py-2">Github</Link></li>
                <li className="py-2">Email: 9009wwb@gmail.com</li>
                <li>Feedback: <Link href="https://github.com/physis9009/PMP" className="italic text-grn-gr hover:text-grn py-2">Submit a Bug or Feature Request</Link></li>
            </ul>
            
        </div>

        <div className="grid grid-cols-1 p-4 mb-2">
            <h4 className="border-l-pnk-gr border-l-2 h-6 px-2 text-sm">License</h4>
            <ul className="px-4 gird grid-cols-1 gap-y-6">
                <li><Link href="https://github.com/physis9009/PMP" className="italic text-grn-gr hover:text-grn py-2">MIT License</Link></li>
                <li className="py-2">© 2026 SnippetSparkle</li>
            </ul>
        </div>
    </footer>;
}
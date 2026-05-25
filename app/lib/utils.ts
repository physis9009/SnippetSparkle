export function generatePagination(currentPage: number, totalPages: number) {
    if (totalPages <= 7) {
        return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

export function toTagKey(displayName: string): string {
    return displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')  // 将非字母数字替换为连字符
        .replace(/^-|-$/g, '');        // 去除首尾连字符
}

export const supportedLanguages = [
    "1C", "4D", "ABAP", "ABNF", "Access logs", "Ada", "ARM assembler",
    "AVR assembler", "ActionScript", "Alan IF", "Alan", "AngelScript",
    "Apache", "AppleScript", "Arcade", "AsciiDoc", "AspectJ", "AutoHotkey",
    "AutoIt", "Awk", "Bash", "Basic", "Blade (Laravel)", "BNF", "Brainfuck",
    "C", "C#", "C++", "C/AL", "Cache Object Script", "CMake", "Coq", "CSP",
    "CSS", "Cap'n Proto", "Chapel", "Cisco CLI", "Clojure", "CoffeeScript",
    "Crmsh", "Crystal", "Cypher (Neo4j)", "D", "Dart", "Delphi", "Diff",
    "Django", "DNS Zone file", "Dockerfile", "DOS", "DTS (Device Tree)",
    "Dust", "EBNF", "Elixir", "Elm", "Erlang", "Excel", "F#", "FIX",
    "Fortran", "G-Code", "Gams", "GAUSS", "GDScript", "Gherkin", "Go", "Golo",
    "Gradle", "Groovy", "HTML, XML", "HTTP", "Haml", "Handlebars", "Haskell",
    "Haxe", "High-level shader language", "Hy", "Ini, TOML", "Inform7",
    "IRPF90", "JSON", "Java", "JavaScript", "Julia", "Kotlin", "LaTeX", "Leaf",
    "Lasso", "Less", "LDIF", "Lisp", "LiveCode Server", "LiveScript", "Lua",
    "Makefile", "Markdown", "Mathematica", "Matlab", "Maxima",
    "Maya Embedded Language", "Mercury", "Mizar", "Mojolicious", "Monkey",
    "Moonscript", "N1QL", "NSIS", "Nginx", "Nim", "Nix",
    "Object Constraint Language", "OCaml", "Objective C",
    "OpenGL Shading Language", "OpenSCAD", "Oracle Rules Language", "Oxygene",
    "PF", "PHP", "Parser3", "Perl", "Plaintext", "Pony", "PostgreSQL & PL/pgSQL",
    "PowerShell", "Processing", "Prolog", "Properties", "Protocol Buffers",
    "Puppet", "Python", "Python profiler results", "Python REPL", "Q", "QML",
    "R", "Razor CSHTML", "ReasonML", "RenderMan RIB", "RenderMan RSL",
    "Roboconf", "Ruby", "Rust", "SAS", "SCSS", "SQL", "STEP Part 21", "Scala",
    "Scheme", "Scilab", "Shell", "Smali", "Smalltalk", "Stan", "Stata",
    "Structured Text", "Stylus", "SubUnit", "Supercollider", "Swift", "Tcl",
    "Terraform (HCL)", "Test Anything Protocol", "TeX", "Thrift", "TP", "Twig",
    "TypeScript", "VB.Net", "VBScript", "VHDL", "Vala", "Verilog", "Vim Script",
    "x86 Assembly", "XL", "XQuery", "YAML", "Zephir"
];
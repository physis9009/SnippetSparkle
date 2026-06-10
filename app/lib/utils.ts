import hljs from 'highlight.js';
import { Snippet, SnippetWithHighlight } from './definitions';

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


/**
 * 将 supportedLanguages 中的显示名称映射到 highlight.js 的语言标识符
 */
const languageMap: Record<string, string> = {
  // 数字和字母开头
  '1C': 'mql5', // 1C 不直接支持，使用最接近的
  '4D': 'bash', // 4D 不支持，降级处理
  
  // A
  'ABAP': 'abap',
  'ABNF': 'abnf',
  'Access logs': 'accesslog',
  'Ada': 'ada',
  'ARM assembler': 'armasm',
  'AVR assembler': 'avrasm',
  'ActionScript': 'actionscript',
  'Alan IF': 'plaintext', // Alan IF 不支持
  'Alan': 'plaintext', // Alan 不支持
  'AngelScript': 'angelscript',
  'Apache': 'apache',
  'AppleScript': 'applescript',
  'Arcade': 'plaintext', // Arcade 不支持
  'AsciiDoc': 'asciidoc',
  'AspectJ': 'java', // AspectJ 不支持，使用 Java
  'AutoHotkey': 'autohotkey',
  'AutoIt': 'autoit',
  'Awk': 'awk',
  
  // B
  'Bash': 'bash',
  'Basic': 'basic',
  'Blade (Laravel)': 'blade',
  'BNF': 'bnf',
  'Brainfuck': 'brainfuck',
  
  // C
  'C': 'c',
  'C#': 'csharp',
  'C++': 'cpp',
  'C/AL': 'cal', // C/AL (Navision) 
  'Cache Object Script': 'cacheobjectscript',
  'CMake': 'cmake',
  'Coq': 'coq',
  'CSP': 'plaintext', // CSP 不支持
  'CSS': 'css',
  'Cap\'n Proto': 'capnp',
  'Chapel': 'chapel',
  'Cisco CLI': 'plaintext', // Cisco CLI 不直接支持
  'Clojure': 'clojure',
  'CoffeeScript': 'coffeescript',
  'Crmsh': 'crmsh',
  'Crystal': 'crystal',
  'Cypher (Neo4j)': 'cypher',
  
  // D
  'D': 'd',
  'Dart': 'dart',
  'Delphi': 'delphi',
  'Diff': 'diff',
  'Django': 'django',
  'DNS Zone file': 'dns',
  'Dockerfile': 'dockerfile',
  'DOS': 'dos',
  'DTS (Device Tree)': 'dts',
  'Dust': 'dust',
  
  // E
  'EBNF': 'ebnf',
  'Elixir': 'elixir',
  'Elm': 'elm',
  'Erlang': 'erlang',
  'Excel': 'excel',
  
  // F
  'F#': 'fsharp',
  'FIX': 'fix',
  'Fortran': 'fortran',
  
  // G
  'G-Code': 'gcode',
  'Gams': 'gams',
  'GAUSS': 'gauss',
  'GDScript': 'gdscript',
  'Gherkin': 'gherkin',
  'Go': 'go',
  'Golo': 'golo',
  'Gradle': 'gradle',
  'Groovy': 'groovy',
  
  // H
  'HTML, XML': 'xml',
  'HTTP': 'http',
  'Haml': 'haml',
  'Handlebars': 'handlebars',
  'Haskell': 'haskell',
  'Haxe': 'haxe',
  'High-level shader language': 'hlsl',
  'Hy': 'hy',
  
  // I
  'Ini, TOML': 'ini',
  'Inform7': 'inform7',
  'IRPF90': 'fortran', // IRPF90 基于 Fortran
  
  // J
  'JSON': 'json',
  'Java': 'java',
  'JavaScript': 'javascript',
  'Julia': 'julia',
  
  // K
  'Kotlin': 'kotlin',
  
  // L
  'LaTeX': 'latex',
  'Leaf': 'plaintext', // Leaf 不支持
  'Lasso': 'lasso',
  'Less': 'less',
  'LDIF': 'ldif',
  'Lisp': 'lisp',
  'LiveCode Server': 'livecodescript',
  'LiveScript': 'livescript',
  'Lua': 'lua',
  
  // M
  'Makefile': 'makefile',
  'Markdown': 'markdown',
  'Mathematica': 'mathematica',
  'Matlab': 'matlab',
  'Maxima': 'maxima',
  'Maya Embedded Language': 'mel',
  'Mercury': 'mercury',
  'Mizar': 'mizar',
  'Mojolicious': 'perl', // Mojolicious 基于 Perl
  'Monkey': 'monkey',
  'Moonscript': 'moonscript',
  
  // N
  'N1QL': 'n1ql',
  'NSIS': 'nsis',
  'Nginx': 'nginx',
  'Nim': 'nim',
  'Nix': 'nix',
  
  // O
  'Object Constraint Language': 'plaintext', // OCL 不支持
  'OCaml': 'ocaml',
  'Objective C': 'objectivec',
  'OpenGL Shading Language': 'glsl',
  'OpenSCAD': 'openscad',
  'Oracle Rules Language': 'plaintext', // ORL 不支持
  'Oxygene': 'oxygene',
  
  // P
  'PF': 'pf',
  'PHP': 'php',
  'Parser3': 'parser3',
  'Perl': 'perl',
  'Plaintext': 'plaintext',
  'Pony': 'pony',
  'PostgreSQL & PL/pgSQL': 'pgsql',
  'PowerShell': 'powershell',
  'Processing': 'processing',
  'Prolog': 'prolog',
  'Properties': 'properties',
  'Protocol Buffers': 'protobuf',
  'Puppet': 'puppet',
  'Python': 'python',
  'Python profiler results': 'plaintext', // 特殊格式
  'Python REPL': 'python',
  
  // Q
  'Q': 'q',
  'QML': 'qml',
  
  // R
  'R': 'r',
  'Razor CSHTML': 'plaintext', // Razor 不直接支持，可考虑 xml
  'ReasonML': 'reasonml',
  'RenderMan RIB': 'rib',
  'RenderMan RSL': 'rsl',
  'Roboconf': 'roboconf',
  'Ruby': 'ruby',
  'Rust': 'rust',
  
  // S
  'SAS': 'sas',
  'SCSS': 'scss',
  'SQL': 'sql',
  'STEP Part 21': 'step21',
  'Scala': 'scala',
  'Scheme': 'scheme',
  'Scilab': 'scilab',
  'Shell': 'shell',
  'Smali': 'smali',
  'Smalltalk': 'smalltalk',
  'Stan': 'stan',
  'Stata': 'stata',
  'Structured Text': 'structuredtext',
  'Stylus': 'stylus',
  'SubUnit': 'subunit',
  'Supercollider': 'supercollider',
  'Swift': 'swift',
  
  // T
  'Tcl': 'tcl',
  'Terraform (HCL)': 'hcl',
  'Test Anything Protocol': 'tap',
  'TeX': 'tex',
  'Thrift': 'thrift',
  'TP': 'tp',
  'Twig': 'twig',
  'TypeScript': 'typescript',
  
  // V
  'VB.Net': 'vbnet',
  'VBScript': 'vbscript',
  'VHDL': 'vhdl',
  'Vala': 'vala',
  'Verilog': 'verilog',
  'Vim Script': 'vim',
  
  // X
  'x86 Assembly': 'x86asm',
  'XL': 'xl',
  'XQuery': 'xquery',
  
  // Y
  'YAML': 'yaml',
  
  // Z
  'Zephir': 'zephir',
};

/**
 * Highlight code with language-specific optimization
 * Uses hljs.highlight() with specific language for better performance
 * Falls back to highlightAuto() if language is not found or fails
 */
export function highlightCode(code: string, language: string): string {
  try {
    const hlsLanguage = languageMap[language];
    
    if (!hlsLanguage) {
      // 如果语言不在映射表中，使用自动检测
      console.warn(`Language "${language}" not found in map, using auto-detection`);
      const result = hljs.highlightAuto(code);
      return result.value;
    }
    
    // Try to highlight with specific language
    try {
      const result = hljs.highlight(code, { 
        language: hlsLanguage, 
        ignoreIllegals: true 
      });
      return result.value;
    } catch (error) {
      console.warn(`Failed to highlight with language "${hlsLanguage}", falling back to auto-detection`);
      // 如果特定语言失败，降级到自动检测
      const result = hljs.highlightAuto(code);
      return result.value;
    }
  } catch (error) {
    console.error(`Failed to highlight code:`, error);
    // 最后的降级：返回转义的代码
    return code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

/**
 * Highlight all snippets with language-specific optimization
 * Can be cached on the server
 */
export function highlightSnippets(snippets: Snippet[]): SnippetWithHighlight[] {
  return snippets.map(snippet => ({
    ...snippet,
    highlightedCode: highlightCode(snippet.code, snippet.language),
  }));
}


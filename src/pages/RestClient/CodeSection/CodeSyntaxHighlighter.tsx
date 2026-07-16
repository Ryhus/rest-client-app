import type { ReactNode } from 'react';

export type CodeLanguage = 'shell' | 'javascript' | 'python' | 'java' | 'csharp' | 'go';

interface CodeSyntaxHighlighterProps {
  code: string;
  language: CodeLanguage;
}

const keywords: Record<CodeLanguage, readonly string[]> = {
  shell: ['curl'],
  javascript: [
    'async',
    'await',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'from',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'let',
    'new',
    'null',
    'return',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'undefined',
    'var',
    'while',
  ],
  python: [
    'and',
    'as',
    'async',
    'await',
    'break',
    'class',
    'continue',
    'def',
    'elif',
    'else',
    'except',
    'False',
    'finally',
    'for',
    'from',
    'if',
    'import',
    'in',
    'is',
    'lambda',
    'None',
    'not',
    'or',
    'pass',
    'raise',
    'return',
    'True',
    'try',
    'while',
    'with',
    'yield',
  ],
  java: [
    'boolean',
    'break',
    'case',
    'catch',
    'class',
    'double',
    'else',
    'false',
    'final',
    'float',
    'for',
    'if',
    'import',
    'int',
    'long',
    'new',
    'null',
    'private',
    'protected',
    'public',
    'return',
    'short',
    'static',
    'this',
    'throw',
    'throws',
    'true',
    'try',
    'void',
    'while',
  ],
  csharp: [
    'async',
    'await',
    'bool',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'decimal',
    'double',
    'else',
    'false',
    'finally',
    'for',
    'foreach',
    'if',
    'int',
    'long',
    'namespace',
    'new',
    'null',
    'private',
    'protected',
    'public',
    'readonly',
    'return',
    'static',
    'string',
    'this',
    'throw',
    'true',
    'try',
    'using',
    'var',
    'void',
    'while',
  ],
  go: [
    'break',
    'case',
    'chan',
    'const',
    'continue',
    'default',
    'defer',
    'else',
    'fallthrough',
    'false',
    'for',
    'func',
    'go',
    'goto',
    'if',
    'import',
    'interface',
    'map',
    'nil',
    'package',
    'range',
    'return',
    'select',
    'struct',
    'switch',
    'true',
    'type',
    'var',
  ],
};

const stringPattern = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/.source;
const numberPattern = /\b(?:0x[\da-f]+|\d+(?:\.\d+)?)\b/i.source;
const functionPattern = /\b[A-Za-z_$][\w$]*(?=\s*\()/.source;
const shellOptionPattern = /--?[A-Za-z][\w-]*/.source;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getTokenPattern(language: CodeLanguage) {
  const commentPattern =
    language === 'python' || language === 'shell'
      ? /#[^\n]*/.source
      : /\/\/[^\n]*|\/\*[\s\S]*?\*\//.source;
  const keywordPattern = `\\b(?:${keywords[language].map(escapeRegExp).join('|')})\\b`;
  const patterns = [stringPattern, commentPattern, numberPattern, keywordPattern, functionPattern];

  if (language === 'shell') {
    patterns.splice(2, 0, shellOptionPattern);
  }

  return new RegExp(patterns.join('|'), 'gi');
}

function getTokenClass(token: string, language: CodeLanguage) {
  if (/^["'`]/.test(token)) return 'code-token--string';
  if (token.startsWith('//') || token.startsWith('/*') || token.startsWith('#')) {
    return 'code-token--comment';
  }
  if (language === 'shell' && /^--?/.test(token)) return 'code-token--option';
  if (/^(?:0x[\da-f]+|\d+(?:\.\d+)?)$/i.test(token)) return 'code-token--number';
  if (keywords[language].some((keyword) => keyword.toLowerCase() === token.toLowerCase())) {
    return 'code-token--keyword';
  }
  return 'code-token--function';
}

export default function CodeSyntaxHighlighter({ code, language }: CodeSyntaxHighlighterProps) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(getTokenPattern(language))) {
    const index = match.index;

    if (index > lastIndex) nodes.push(code.slice(lastIndex, index));
    nodes.push(
      <span className={`code-token ${getTokenClass(match[0], language)}`} key={index}>
        {match[0]}
      </span>
    );
    lastIndex = index + match[0].length;
  }

  if (lastIndex < code.length) nodes.push(code.slice(lastIndex));

  return <>{nodes}</>;
}

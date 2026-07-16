interface SyntaxHighlighterProps {
  value: string;
  language: 'text' | 'json';
}

const JSON_TOKEN_PATTERN =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

function getJsonTokenClass(token: string, isProperty: boolean) {
  if (isProperty) return 'syntax-token--property';
  if (token.startsWith('"')) return 'syntax-token--string';
  if (token === 'true' || token === 'false') return 'syntax-token--boolean';
  if (token === 'null') return 'syntax-token--null';
  return 'syntax-token--number';
}

function highlightJsonLine(line: string, lineIndex: number) {
  const tokens: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(JSON_TOKEN_PATTERN)) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) tokens.push(line.slice(lastIndex, matchIndex));

    tokens.push(
      <span
        className={`syntax-token ${getJsonTokenClass(match[0], Boolean(match[2]))}`}
        key={`${lineIndex}-${matchIndex}`}
      >
        {match[0]}
      </span>
    );
    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < line.length) tokens.push(line.slice(lastIndex));
  return tokens;
}

export function isJson(value: string) {
  if (!value.trim()) return false;

  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export default function SyntaxHighlighter({ value, language }: SyntaxHighlighterProps) {
  const lines = value.split('\n');

  return lines.map((line, index) => (
    <span className="syntax-highlight__line" key={index}>
      {language === 'json' ? highlightJsonLine(line, index) : line}
      {index < lines.length - 1 ? '\n' : null}
    </span>
  ));
}

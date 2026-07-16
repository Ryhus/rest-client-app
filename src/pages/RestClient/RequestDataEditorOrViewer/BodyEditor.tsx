import { useRef, type ChangeEventHandler, type UIEventHandler } from 'react';

interface BodyEditorProps {
  value: string;
  language: 'text' | 'json';
  ariaLabel: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
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

export default function BodyEditor({ value, language, ariaLabel, onChange }: BodyEditorProps) {
  const highlightRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLOListElement>(null);
  const lines = value.split('\n');

  const handleScroll: UIEventHandler<HTMLTextAreaElement> = (event) => {
    const { scrollLeft, scrollTop } = event.currentTarget;

    if (highlightRef.current) {
      highlightRef.current.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.style.transform = `translateY(${-scrollTop}px)`;
    }
  };

  return (
    <div className="body-editor" data-language={language}>
      <div className="body-editor__gutter" aria-hidden="true">
        <ol className="body-editor__line-numbers" ref={lineNumbersRef}>
          {lines.map((_, index) => (
            <li key={index}>{index + 1}</li>
          ))}
        </ol>
      </div>

      <div className="body-editor__highlight-viewport" aria-hidden="true">
        <pre className="body-editor__highlight" ref={highlightRef} data-testid="syntax-highlight">
          {lines.map((line, index) => (
            <span className="body-editor__line" key={index}>
              {language === 'json' ? highlightJsonLine(line, index) : line}
              {index < lines.length - 1 ? '\n' : null}
            </span>
          ))}
        </pre>
      </div>

      <textarea
        className="body-editor__textarea"
        id="data-editor-editor"
        aria-label={ariaLabel}
        onChange={onChange}
        onScroll={handleScroll}
        value={value}
        spellCheck={language === 'text'}
        data-testid="textarea-body-editor"
      />
    </div>
  );
}

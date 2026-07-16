import { useRef, type ChangeEventHandler, type UIEventHandler } from 'react';
import SyntaxHighlighter from './SyntaxHighlighter';

interface BodyEditorProps {
  value: string;
  language: 'text' | 'json';
  ariaLabel: string;
  errorId?: string;
  isInvalid?: boolean;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
}

export default function BodyEditor({
  value,
  language,
  ariaLabel,
  errorId,
  isInvalid = false,
  onChange,
}: BodyEditorProps) {
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
          <SyntaxHighlighter value={value} language={language} />
        </pre>
      </div>

      <textarea
        className="body-editor__textarea"
        id="data-editor-editor"
        aria-label={ariaLabel}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : undefined}
        onChange={onChange}
        onScroll={handleScroll}
        value={value}
        spellCheck={language === 'text'}
        data-testid="textarea-body-editor"
      />
    </div>
  );
}

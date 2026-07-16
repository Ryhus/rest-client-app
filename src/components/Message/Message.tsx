import './Message.scss';

interface MessageProps {
  text: string;
  messageType?: string;
}

export default function Message({ text, messageType }: MessageProps) {
  const isWarning = messageType === 'warning';

  return (
    <div
      className={`message message--${messageType}`}
      role={isWarning ? 'alert' : 'status'}
      aria-live={isWarning ? 'assertive' : 'polite'}
    >
      {text}
    </div>
  );
}

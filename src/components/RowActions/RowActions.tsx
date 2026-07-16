import './RowActionsStyles.scss';

interface RowActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function RowActions({ children, className = '', ...props }: RowActionsProps) {
  return (
    <div role="group" aria-label="Row actions" className={`row-actions ${className}`} {...props}>
      {children}
    </div>
  );
}

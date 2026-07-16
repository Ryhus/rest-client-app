import logo from '@/assets/img/logo.svg';

import './SpinnerStyles.scss';

interface SpinnerProps {
  alt?: string;
}

export default function Spinner({ alt = 'Loading...' }: SpinnerProps) {
  return <img src={logo} alt={alt} className="spinner" data-testid="spinner" />;
}

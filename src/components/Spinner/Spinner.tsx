import logo from '@/assets/img/logo.svg';

import './SpinnerStyles.scss';

export default function Spinner() {
  return <img src={logo} alt="Loading..." className="spinner" />;
}

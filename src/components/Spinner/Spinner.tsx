import logo from '@/assets/img/Logo.svg';

import './SpinnerStyles.scss';

export default function Spinner() {
  return <img src={logo} alt="Loading..." className="spinner" />;
}

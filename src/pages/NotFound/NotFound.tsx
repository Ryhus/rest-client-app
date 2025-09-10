import { Button } from '@/components';
import { ButtonStyle, ButtonType } from '@/components/Button/types';
import { useNavigate } from 'react-router-dom';

import './NotFound.scss';

export default function NotFound() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="not-found__container">
      <div className="not-found__content">
        <h1 className="not-found__title">Not Found</h1>
        <p className="not-found__info">This page does not exist</p>
        <Button style={ButtonStyle.Primary} type={ButtonType.Button} onClick={handleClick}>
          To home page
        </Button>
      </div>
      <div className="figure-1"></div>
      <div className="figure-2"></div>
      <div className="figure-3"></div>
      <div className="figure-4"></div>
      <div className="figure-5"></div>
    </div>
  );
}

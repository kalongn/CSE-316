import { useContext, useEffect } from 'react';
import { LoginContext } from '../App';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/general.css';
import '../stylesheets/pages/Home.css';

function Home() {
  const { isLogin } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      navigate('/questions')
    }
  }, [isLogin, navigate]);

  if (!isLogin) {
    return (
      <div className={'page-wrapper home-page-wrapper'}>
        <strong className='big-font'>Welcome to <span>fake</span> StackOverflow</strong>
        <strong className='med-font'>You are viewing in guest mode</strong>
      </div>
    );
  }

  return (
    <div className={'page-wrapper home-page-wrapper'}>
      <strong className='big-font'>Welcome to <span>fake</span> StackOverflow</strong>
      <p className='med-font'>Redirecting...</p>
    </div>
  );
}

export default Home;

import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../App';

import '../stylesheets/general.css';
import '../stylesheets/components/AskQuestions.css'

function AskQuestion() {
    const { isLogin } = useContext(LoginContext);

    return (
        <>{isLogin ? <Link to='/newquestions' className='ask-question-bttn'>Ask Question</Link> : <Link className='ask-question-bttn invis'>Ask Question</Link>}</>
    )
}

export default AskQuestion;
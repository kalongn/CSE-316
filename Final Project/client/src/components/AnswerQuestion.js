import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../App';

import '../stylesheets/general.css';
import '../stylesheets/components/AskQuestions.css'

function AnswerQuestion(props) {
    const { isLogin } = useContext(LoginContext);
    const { qid } = props;

    return (
        <>
            {isLogin ? <Link className='ask-question-bttn' to={`/newanswers/${qid}`}>Answer Question</Link> : <Link className='ask-question-bttn invis'>Answer Question</Link>}
        </>
    )
}

export default AnswerQuestion;
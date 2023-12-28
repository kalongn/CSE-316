import '../stylesheets/App.css';
import '../stylesheets/AnswerDisplayAnswers.css';

import Answer from './Answer';

function AnswerDisplayAnswers(props) {
    return (
        <div className="answer-scoll-wrapper">
            {props.currentQuestionsAnswer.map((answer, index) => <Answer answer={answer} key={index} />)}
        </div>
    );

}

export default AnswerDisplayAnswers;
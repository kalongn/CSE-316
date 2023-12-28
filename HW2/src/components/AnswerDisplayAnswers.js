import '../stylesheets/App.css';
import '../stylesheets/AnswerDisplayAnswers.css';

import Answer from './Answer';

function AnswerDisplayAnswers(props) {
    const allAnswers = props.answers.filter(answer => props.currentQuestionsAnswer.includes(answer.aid));
    return (
        <div className="answer-scoll-wrapper">
            {allAnswers.map((answer, index) => <Answer answer={answer} key={index}/>)}
        </div>
    );

}

export default AnswerDisplayAnswers;
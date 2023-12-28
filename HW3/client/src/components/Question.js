import '../stylesheets/App.css';
import '../stylesheets/Question.css';

import { timeElapsedDisplay } from '../helper.js';

import QuestionTag from './QuestionTag.js';

function Question(props) {

    function questionClick(qid) {
        props.setQuestionAnswerId(qid);
        props.setPageToDisplay(() => "answer");
    }

    return (
        <div className="question">
            <div className="question-info">
                <div className="question-info-left">
                    <div>
                        <span>{props.question.answers.length}</span> answers
                    </div>
                    <div>
                        <span>{props.question.views}</span> views
                    </div>
                </div>
                <div onClick={() => questionClick(props.question._id)} className="question-title bold title-font">
                    {props.question.title}
                </div>

                <div className="question-info-right">
                    <span className="question-user-name">{props.question.asked_by}</span> asked <span>{timeElapsedDisplay(props.question.asked_date_time)}</span>
                </div>
            </div>
            <div className="question-tags">
                {props.question.tags.map((tagObject, index) => (
                    <QuestionTag key={index} tag={tagObject.name} />
                ))}
            </div>
        </div>
    );
}

export default Question;
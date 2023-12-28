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
                        <span>{props.question.ansIds.length}</span> answers
                    </div>
                    <div>
                        <span>{props.question.views}</span> views
                    </div>
                </div>
                <div onClick={() => questionClick(props.question.qid)} className="question-title bold title-font">
                    {props.question.title}
                </div>

                <div className="question-info-right">
                    <span className="question-user-name">{props.question.askedBy}</span> asked <span>{timeElapsedDisplay(props.question.askDate)}</span>
                </div>
            </div>
            <div className="question-tags">
                {props.question.tagIds.map((tid, index) => (
                    <QuestionTag key={index} tags={props.tags} tag={tid} />
                ))}
            </div>
        </div>
    );
}

export default Question;
import { Link } from 'react-router-dom';

import '../stylesheets/general.css';
import '../stylesheets/components/Question.css'

import QuestionTag from './QuestionTag'
import { timeElapsedDisplay } from '../helper'

function Question(props) {
    const question = props.question;
    return (
        <div className={"question-wrapper"}>
            <div className={"question-stats-wrapper"}>
                <div>{question.vote} votes</div>
                <div>{question.answers.length} answers</div>
                <div>{question.views} views</div>
            </div>
            <div className={"question-main-wrapper"}>
                <Link className={"link-to-question"} to={`/question/${question._id}`}>
                    <div>{question.title}</div>
                </Link>
                <div className={"question-summary-wrapper"}>
                    <div>{question.summary}</div>
                </div>
                <div className={"question-tags-wrapper"}>
                    {question.tags.map(tag => { return <QuestionTag key={tag._id} tagName={tag.name} /> })}
                </div>
            </div>
            <div className={"question-time-wrapper"}>
                <span>{question.asked_by.username}</span> asked {timeElapsedDisplay(question.asked_date_time)}
            </div>
        </div>
    );
}

export default Question;
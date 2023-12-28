import AskQuestion from './AskQuestion';
import QuestionTag from './QuestionTag';
import { timeElapsedDisplay } from '../helper';

import '../stylesheets/general.css';
import '../stylesheets/components/AnswersHeader.css'

function AnswersHeader(props) {
    const { question, views } = props;
    const tags = [...question.tags];
    return (
        <div className="answers-header">
            <div className='answers-header-top-row'>
                <div className='answers-title med-font'>{question.title}</div>
                <AskQuestion />
            </div>
            <div className='answers-header-middle-row'>
                {tags.map(tag => { return <QuestionTag key={tag._id} tagName={tag.name} /> })}
            </div>
            <div className='answers-header-bottom-row'>
                <div><span className="answers-username">{question.asked_by.username}</span> <span>asked</span> {timeElapsedDisplay(question.asked_date_time)}<span>, viewed </span>{views + 1}<span> time.</span></div>
            </div>
        </div>
    )
}

export default AnswersHeader;
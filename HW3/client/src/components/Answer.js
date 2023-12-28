import '../stylesheets/App.css';
import '../stylesheets/Answer.css';

import Description from './Description';

import { timeElapsedDisplay } from '../helper';


function Answer(props) {
    return (
        <div className="answer">
            <div className="answer-description">
                <Description description={props.answer.text} />
            </div>
            <div className="answerer-info">
                <div className="answerer-username">
                    {props.answer.ans_by}
                </div>
                <div className="date-answered">
                    answered {timeElapsedDisplay(props.answer.ans_date_time)}
                </div>
            </div>
        </div>
    );

}

export default Answer;
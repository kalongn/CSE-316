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
                    {props.answer.ansBy}
                </div>
                <div className="date-answered">
                    answered {timeElapsedDisplay(props.answer.ansDate)}
                </div>
            </div>
        </div>
    );

}

export default Answer;
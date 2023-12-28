import '../stylesheets/App.css';
import '../stylesheets/AnswerDisplay.css';

import Description from './Description';
import AnswerDisplayAnswers from './AnswerDisplayAnswers';

import { timeElapsedDisplay } from '../helper';

function AnswerDisplay(props) {

    let currentQuestion = props.questions.filter(question => question.qid === props.questionAnswerId)[0];
    currentQuestion.views++;

    function askQuestionClick() {
        console.log("ask quesion button clicked");
        props.setPageToDisplay("newQuestions");
    }

    function giveAnswerClick() {
        console.log("answer question button clicked");
        props.setPageToDisplay("newAnswer")
    }

    return (
        <div id="ans-page-wrapper">
            <div id="ansPg-ques-head">
                <div id="ansPg-ques-head-toprow">
                    <div id="ansPg-ques-answer-num" className="answerPg-bold asn-element-min-width">
                        {currentQuestion.ansIds.length} answers
                    </div>
                    <div id="ansPg-qtitle" className="answerPg-bold">
                        {currentQuestion.title}
                    </div>
                    <div id="ansPg-askQ"><button className="ask-question-button" type="button" onClick={askQuestionClick}>Ask Question</button></div>
                </div>

                <div id="ansPg-ques-head-botrow">
                    <div id="ansPg-ques-views" className="answerPg-bold asn-element-min-width">
                        {currentQuestion.views} views
                    </div>
                    <div id="ansPg-qDescription">
                        <Description description={currentQuestion.text} />
                    </div>
                    <div id="ansPg-ques-user-info">
                        <div id="ansPg-ques-usrname" className="new-questions-page-important">
                            {currentQuestion.askedBy}
                        </div>
                        <div id="ansPg-ques-askDate" className="date">
                            asked {timeElapsedDisplay(currentQuestion.askDate)}
                        </div>
                    </div>
                </div>
            </div>
            <AnswerDisplayAnswers answers={props.answers} currentQuestionsAnswer={currentQuestion.ansIds} />
            <div id="answer-button">
                <button className="ask-question-button" type="button" onClick={giveAnswerClick}>
                    Answer Question
                </button>
            </div>
        </div>
    );
}

export default AnswerDisplay;
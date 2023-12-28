import '../stylesheets/App.css';
import '../stylesheets/AnswerDisplay.css';

import Description from './Description';
import AnswerDisplayAnswers from './AnswerDisplayAnswers';

import { timeElapsedDisplay, sortQuestionByLatest } from '../helper';

import Axios from 'axios';
import { useEffect } from 'react';
const expressServer = "http://localhost:8000"

function AnswerDisplay(props) {

    const { setQuestions, setDisplayQuestions, questionAnswerId } = props;
    useEffect(() => {
        Axios.patch(`${expressServer}/QuestionViewsIncrement/${questionAnswerId}`)
            .then(() => {
                Axios.get(`${expressServer}/Questions`)
                    .then(res => {
                        setQuestions(res.data);
                        setDisplayQuestions(sortQuestionByLatest(res.data));
                    })
                    .catch(err => {
                        console.error("Error fetching questions after patch request:", err);
                    });
            }).catch(err => {
                console.error("Error patching views. Status code:", err.response.status);
            });
    }, [questionAnswerId, setDisplayQuestions, setQuestions])
    let currentQuestion = props.questions.filter(question => question._id === questionAnswerId)[0];

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
                        {currentQuestion.answers.length} answers
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
                            asked {timeElapsedDisplay(currentQuestion.asked_date_time)}
                        </div>
                    </div>
                </div>
            </div>
            <AnswerDisplayAnswers answers={props.answers} currentQuestionsAnswer={currentQuestion.answers} />
            <div id="answer-button">
                <button className="ask-question-button" type="button" onClick={giveAnswerClick}>
                    Answer Question
                </button>
            </div>
        </div>
    );
}

export default AnswerDisplay;
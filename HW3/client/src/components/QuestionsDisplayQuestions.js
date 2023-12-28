import '../stylesheets/App.css';
import '../stylesheets/QuestionsDisplayQuestions.css';

import Question from './Question';

function QuestionsDisplayQuestions(props) {
    return (
        <div id="questions-wrapper">
            {props.searchResult ? props.displayQuestions.map((question, index) =>
                <Question key={index}
                    question={question}
                    tags={props.tags}
                    setQuestionAnswerId={props.setQuestionAnswerId}
                    setPageToDisplay={props.setPageToDisplay} />)
                :
                <div className="question-not-found bold big-font">No Question Found.</div>}
        </div>
    );
}

export default QuestionsDisplayQuestions;
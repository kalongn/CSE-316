import '../stylesheets/App.css';
import QuestionsDisplayHeader from './QuestionsDisplayHeader';
import QuestionsDisplayQuestions from './QuestionsDisplayQuestions';
import { useState } from 'react';



function QuestionsDisplay(props) {
    const [_searchResult, setSearchResult] = useState(true);
    return (
        <div id="main">
            <QuestionsDisplayHeader
                questions={props.questions}
                answers={props.answers}
                tags={props.tags}
                displayQuestions={props.displayQuestions} setDisplayQuestions={props.setDisplayQuestions}
                questionsHeaderDisplay={props.questionsHeaderDisplay} setQuestionsHeaderDisplay={props.setQuestionsHeaderDisplay}
                searchTerm={props.searchTerm}
                searchResult={_searchResult} setSearchResult={setSearchResult}
                searchFocus={props.searchFocus} setSearchFocus={props.setSearchFocus}
                pageToDisplay={props.pageToDisplay} setPageToDisplay={props.setPageToDisplay}
            />
            <QuestionsDisplayQuestions
                questions={props.questions}
                tags={props.tags}
                answers={props.answers}
                displayQuestions={props.displayQuestions}
                searchResult={_searchResult}
                setQuestionAnswerId={props.setQuestionAnswerId}
                setPageToDisplay={props.setPageToDisplay} />
        </div>
    );
}

export default QuestionsDisplay;
import '../stylesheets/App.css';
import '../stylesheets/TagsDisplay.css';

import TagsDisplayTags from './TagsDisplayTags';

function TagsDisplay(props) {
    function askQuestionClick() {
        console.log("button clicked");
        props.setPageToDisplay("newQuestions");
    }
    return (
        <div id="tag-main">
            <div className="main-body-header">
                <h2 className="tag-body-header"><span>{props.tags.length}</span> Tags</h2>
                <h1 className="tag-body-header">All Tags</h1>
                <button className="ask-question-button" type="button" onClick={askQuestionClick}>Ask Question</button>
            </div>
            <TagsDisplayTags
                questions={props.questions}
                tags={props.tags}
                setDisplayQuestions={props.setDisplayQuestions}
                setQuestionsHeaderDisplay={props.setQuestionsHeaderDisplay}
                setPageToDisplay={props.setPageToDisplay}
            />
        </div>
    );
}

export default TagsDisplay;
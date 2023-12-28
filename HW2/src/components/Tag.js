import '../stylesheets/App.css';
import '../stylesheets/Tag.css';

function Tag(props) {
    const questions = allQuestionsFromThisTag(props.tag.tid, props.questions);

    function generateQuetionOnClick() {
        props.setDisplayQuestions(questions);
        props.setQuestionsHeaderDisplay(() => 2);
        props.setPageToDisplay("questions");
    }

    //To Tmr Me, Tags question seems to be updated but get overrule by something.

    return (
        <div id="tag-body-items">
            <div className="border-dash">
                <button onClick={generateQuetionOnClick}><span className="tag-body-items-title">{props.tag.name}</span></button>
                <div><span>{questions.length}</span> questions</div>
            </div>
        </div>
    );
}

function allQuestionsFromThisTag(tid, questions) {
    questions = [...questions];
    return questions.filter(question => question.tagIds.includes(tid));
}

export default Tag;
import '../stylesheets/App.css';
import '../stylesheets/Tag.css';

function Tag(props) {
    const questions = allQuestionsFromThisTag(props.tag, props.questions);

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

function allQuestionsFromThisTag(tag, questions) {
    questions = [...questions];
    console.log(questions[0].tags);
    console.log(tag);
    return questions.filter(question => question.tags.some(qtag => qtag.id === tag.id));
}

export default Tag;
import '../stylesheets/App.css';
import '../stylesheets/QuestionTag.css';

function QuestionTag(props) {
    return (
        <button className="question-tag">{props.tag}</button>
    );
}

export default QuestionTag;
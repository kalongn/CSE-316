import '../stylesheets/App.css';
import '../stylesheets/QuestionTag.css';

function QuestionTag(props) {
    return (
        <button className="question-tag">{props.tags.filter(tag => tag.tid === props.tag).map(tag => tag.name)}</button>
    );
}

export default QuestionTag;
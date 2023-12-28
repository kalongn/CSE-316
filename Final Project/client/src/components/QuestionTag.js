import '../stylesheets/general.css';
import '../stylesheets/components/QuestionTag.css'

function QuestionTag(props) {
    return (
        <div className='tag-wrapper'>
            {props.tagName}
        </div>
    )
}

export default QuestionTag;

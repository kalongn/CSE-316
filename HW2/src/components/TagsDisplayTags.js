import '../stylesheets/App.css';
import '../stylesheets/TagsDisplayTags.css';
import Tag from './Tag';

function TagsDisplayTags(props) {
    return (
        <div id="tag-body-tags">
            {props.tags.map((tag, index) => <Tag key={index} tag={tag}
                questions={props.questions} 
                setDisplayQuestions={props.setDisplayQuestions}
                setQuestionsHeaderDisplay={props.setQuestionsHeaderDisplay} 
                setPageToDisplay={props.setPageToDisplay}
                />
            )}
        </div>
    );
}

export default TagsDisplayTags;



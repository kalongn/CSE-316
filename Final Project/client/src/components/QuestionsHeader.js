import AskQuestion from './AskQuestion';

import '../stylesheets/general.css';
import '../stylesheets/components/QuestionsHeader.css'

function QuestionsHeader(props) {
    const { setSortType, title, questionsLength } = props;

    return (
        <div className='Header-wrapper'>
            <div className="Top-row-Header-Wrapper">
                <h2>{title}</h2>
                <div className='dummy'></div>
                <AskQuestion />
            </div>
            <div className="Bottom-row-Header-Wrapper">
                <div className='bold small-font'>{questionsLength || 0} questions </div>
                <div className='dummy'></div>
                <button onClick={() => setSortType("Newest")} className='filter-bttn'>Newest</button>
                <button onClick={() => setSortType("Active")} className='filter-bttn'>Active</button>
                <button onClick={() => setSortType("Unanswered")} className='filter-bttn'>Unanswered</button>
            </div>
        </div>
    )
}

export default QuestionsHeader;
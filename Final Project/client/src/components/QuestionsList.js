import { useEffect, useState } from 'react';
import { sortQuestionByLatest, sortQuestionByActive, sortQuestionByUnanswered, createGroup } from '../helper';

import Question from '../components/Question';

import '../stylesheets/general.css';
import '../stylesheets/components/QuestionsList.css'

function QuestionsList(props) {
    const { questions, sortType } = props;
    const [displayQuestions, setDisplayQuestions] = useState([]);
    const [currentDisplayQuestions, setCurrentDisplayQuestions] = useState([]);
    const [currentQuestionsIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        let display;
        switch (sortType) {
            case 'Newest':
                display = sortQuestionByLatest(questions);
                break;
            case 'Active':
                display = sortQuestionByActive(questions);
                break;
            case 'Unanswered':
                display = sortQuestionByUnanswered(questions);
                break;
            default:
                break;
        }
        setDisplayQuestions(display);
    }, [questions, sortType])

    useEffect(() => {
        const currentDisplay = createGroup(displayQuestions, 5);
        setCurrentDisplayQuestions(currentDisplay)
        setCurrentQuestionIndex(0);
    }, [displayQuestions]);

    const handlePrevButton = () => {
        if (currentQuestionsIndex > 0) {
            setCurrentQuestionIndex(currentQuestionsIndex - 1);
        }
    }
    const handleNextButton = () => {
        if (currentQuestionsIndex < currentDisplayQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionsIndex + 1);
        }
    }

    return (
        <>
            <div className="question-list">
                {currentDisplayQuestions.length > 0 && currentDisplayQuestions[currentQuestionsIndex].map(question => (
                    <Question key={question._id} question={question} />
                ))}
            </div>
            <div className='prev-next-wrapper'>
                <button onClick={handlePrevButton}>prev</button>
                <div>Page <span>{currentQuestionsIndex + 1}</span></div>
                <button onClick={handleNextButton}>next</button>
            </div>
        </>
    )

}

export default QuestionsList;
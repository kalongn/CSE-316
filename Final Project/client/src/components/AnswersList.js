import { useEffect, useState } from 'react';

import Answer from './Answer';
import AnswerQuestion from './AnswerQuestion';
import { sortAnswersByLatest, createGroup } from '../helper';

import '../stylesheets/general.css';
import '../stylesheets/components/AnswersList.css'


import Axios from 'axios';
const expressServer = "http://localhost:8000";

function AnswersList(props) {
    const { qid, answers, setDataFetchSuccess, user, uid } = props;
    const [allAnswers, setAllAnswers] = useState([]);
    const [currentDisplayAnswers, setCurrentDisplayAnswers] = useState([]);
    const [currentAnswersIndex, setCurrentAnswersIndex] = useState(0);

    useEffect(() => {
        Axios.get(`${expressServer}/answers`, { params: { ids: answers.map(answer => answer._id) } })
            .then(res => {
                uid ? setAllAnswers(sortAnswersByUserFirst(res.data, uid)) : setAllAnswers(sortAnswersByLatest(res.data));
                setDataFetchSuccess(1);
            })
            .catch(err => {
                console.log(err);
                setDataFetchSuccess(0);
            })
    }, [answers, setDataFetchSuccess, uid])

    useEffect(() => {
        const currentDisplay = createGroup(allAnswers, 5);
        setCurrentDisplayAnswers(currentDisplay)
        setCurrentAnswersIndex(0);
    }, [allAnswers]);

    const handlePrevButton = () => {
        if (currentAnswersIndex > 0) {
            setCurrentAnswersIndex(currentAnswersIndex - 1);
        }
    }
    const handleNextButton = () => {
        if (currentAnswersIndex < currentDisplayAnswers.length - 1) {
            setCurrentAnswersIndex(currentAnswersIndex + 1);
        }
    }

    function sortAnswersByUserFirst(answers, uid) {
        let answersByUser = answers.filter(answer => answer.ans_by._id === uid);
        let answersByOther = answers.filter(answer => answer.ans_by._id !== uid);
        answersByUser = sortAnswersByLatest(answersByUser)
        answersByOther = sortAnswersByLatest(answersByOther);
        return answersByUser.concat(answersByOther);
    }

    return (
        <>
            <div className='answers-stat-wrapper bold small-font'>
                <div>{answers.length} answers</div>
                <div className='dummy'></div>
                <AnswerQuestion qid={qid} />
            </div>
            <div className='answer-list'>
                {currentDisplayAnswers.length > 0 && currentDisplayAnswers[currentAnswersIndex].map(answer => (
                    <Answer key={answer._id} answer={answer} qid={qid} setDataFetchSuccess={setDataFetchSuccess} user={user} />
                ))}
            </div>
            <div className='prev-next-wrapper'>
                <button onClick={handlePrevButton}>prev</button>
                <div>Page <span>{currentAnswersIndex + 1}</span></div>
                <button onClick={handleNextButton}>next</button>
            </div>
        </>
    )
}

export default AnswersList
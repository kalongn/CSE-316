import { useState, useEffect, useContext } from 'react'
import { LoginContext } from '../App'
import { useParams, useNavigate } from 'react-router-dom'

import '../stylesheets/general.css'
import '../stylesheets/pages/NewAnswers.css'

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function EditAnswers() {
    const { isLogin } = useContext(LoginContext);
    const navigate = useNavigate();
    const { aid, answertext, qid, uid } = useParams();

    const [text, setText] = useState(answertext);
    const [answerCorrect, setAnswerCorrect] = useState(true);
    const [answerErrorMessage, setAnswerErrorMessage] = useState("");


    useEffect(() => {
        if (!isLogin) {
            navigate("/");
            return;
        }
    }, [isLogin, navigate]);

    function validateHyperLink(text) {
        const regex = /\[([^\]]+)\]\(([^\s)]*)\)/g;
        const allResults = [...text.matchAll(regex)];
        if (allResults.length !== 0) {
            for (const result of allResults) {
                if (result[2] === "") {
                    setAnswerErrorMessage('Error: link cannot be empty');
                    return false;
                }
                if (result[2].indexOf("http://") !== 0 && result[2].indexOf("https://") !== 0) {
                    setAnswerErrorMessage('Error: link must start with http:// or https://');
                    return false;
                }
            }
        }
        return true;
    }

    function submit() {
        if (text.length === 0) {
            setAnswerCorrect(false);
            setAnswerErrorMessage("Error: Answer cannot be empty");
            return;
        }
        if (!validateHyperLink(text)) {
            setAnswerCorrect(false);
            return;
        }
        if (text === answertext) {
            navigate(`/question/${qid}`)
            return;
        }
        Axios.patch(`${expressServer}/profile/answer/${aid}`, { text: text })
            .then(res => {
                navigate(`/question/${qid}/${uid}`)
            }).catch(err => {
                console.log(err);
            });
    }

    function deleteAnswer() {
        Axios.delete(`${expressServer}/profile/answer/${aid}`)
            .then(res => {
                navigate(`/question/${qid}/${uid}`);
            })
            .catch(err => {
                console.log(err);
            })
        return;
    }


    return (
        <div className="page-wrapper new-answer-page-wrapper">
            <div className='question-section-wrapper'>
                <div className='question-section-title bold'>Answer<span>*</span></div>
                <div className='question-section-note'>min. 1 character</div>
                <textarea className='question-section-input' type="text" rows={3} defaultValue={text} onChange={(e) => { setText(e.target.value.trim()) }} />
                <div className='question-section-error'>{answerCorrect ? "" : answerErrorMessage}</div>
            </div>
            <div className='question-button-wrapper'>
                <button className='submit-button bold delete-bttn' onClick={deleteAnswer}>Delete</button>
                <div className='dummy'></div>
                <button className='submit-button bold' onClick={submit}>Submit</button>
            </div>
        </div>
    )
}

export default EditAnswers
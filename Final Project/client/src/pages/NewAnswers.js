import { useState, useEffect, useContext } from 'react'
import { LoginContext } from '../App'
import { useParams, useNavigate } from 'react-router-dom'

import '../stylesheets/general.css'
import '../stylesheets/pages/NewAnswers.css'

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function NewAnswers() {
    const { isLogin } = useContext(LoginContext);
    const navigate = useNavigate();
    const { qid } = useParams();

    const [user, setUser] = useState({});
    const [text, setText] = useState("");
    const [answerCorrect, setAnswerCorrect] = useState(true);
    const [answerErrorMessage, setAnswerErrorMessage] = useState("");


    useEffect(() => {
        if (!isLogin) {
            navigate("/");
            return;
        }
        Axios.get(`${expressServer}/user`, { withCredentials: true })
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                console.log(err);
            });
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
        Axios.post(`${expressServer}/newanswers`, { text, user, qid })
            .then(res => {
                navigate(`/question/${qid}`);
            })
            .catch(err => {
                console.log(err);
            });
    }


    return (
        <div className="page-wrapper new-answer-page-wrapper">
            <div className='question-section-wrapper'>
                <div className='question-section-title bold'>Answer<span>*</span></div>
                <div className='question-section-note'>min. 1 character</div>
                <textarea className='question-section-input' type="text" rows={3} onChange={(e) => { setText(e.target.value.trim()) }} />
                <div className='question-section-error'>{answerCorrect ? "" : answerErrorMessage}</div>
            </div>
            <button className='submit-button bold' onClick={submit}>Submit</button>
        </div>
    )
}

export default NewAnswers
import { useContext, useState, useEffect } from 'react'
import { LoginContext } from '../App'
import { useParams, useNavigate } from 'react-router-dom'

import '../stylesheets/general.css'
import '../stylesheets/pages/NewComments.css'
import '../stylesheets/pages/NewQuestions.css'

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function NewComments() {
    const { isLogin } = useContext(LoginContext)
    const { type, id, qid } = useParams();
    const navigate = useNavigate();

    const [text, setText] = useState("");
    const [commentCorrect, setCommentCorrect] = useState(true);
    const [commentErrorMessage, setCommentErrorMessage] = useState("");
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        if (!isLogin) {
            navigate("/");
            return;
        }
        Axios.get(`${expressServer}/user`, { withCredentials: true })
            .then(res => {
                setCurrentUser(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [isLogin, navigate]);

    function submit() {
        if (currentUser.reputation < 50) {
            setCommentCorrect(false);
            setCommentErrorMessage("Error: reputation needs to be 50 or higher to make a comment.");
            return;
        }
        if (text === "") {
            setCommentCorrect(false);
            setCommentErrorMessage("Error: comment cannot be empty");
            return;
        }
        if (text.length > 140) {
            setCommentCorrect(false);
            setCommentErrorMessage("Error: comment cannot be more than 140 characters");
            return;
        }
        Axios.post(`${expressServer}/newcomments`, { type, id, text, user: currentUser })
            .then(res => {
                navigate(`/question/${qid}`);
            })
            .catch(err => {
                console.log(err);
            });

    }

    return (
        <div className='page-wrapper new-comments-page-wrapper'>
            <div className='question-section-wrapper'>
                <div className='question-section-title bold'>Comment<span>*</span></div>
                <div className='question-section-note'>min. 1 character, max. 140 characters</div>
                <textarea className='question-section-input' type="text" rows={3} onChange={(e) => { setText(e.target.value.trim()) }} />
                <div className='question-section-error'>{commentCorrect ? "" : commentErrorMessage}</div>
            </div>
            <button className='submit-button bold' onClick={submit}>Submit</button>
        </div>
    )
}

export default NewComments
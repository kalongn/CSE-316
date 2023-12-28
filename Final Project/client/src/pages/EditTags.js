import { useContext, useState, useEffect } from 'react'
import { LoginContext } from '../App'
import { useParams, useNavigate } from 'react-router-dom'

import '../stylesheets/general.css'
import '../stylesheets/pages/NewQuestions.css'
import '../stylesheets/components/EditItems.css'


import Axios from 'axios';
const expressServer = "http://localhost:8000";

function EditTags(props) {
    const { isLogin } = useContext(LoginContext)
    const { tagname, tid, uid } = useParams();
    const navigate = useNavigate();

    const [text, setText] = useState(tagname);
    const [commentCorrect, setCommentCorrect] = useState(true);
    const [commentErrorMessage, setCommentErrorMessage] = useState("");

    useEffect(() => {
        if (!isLogin) {
            navigate("/");
            return;
        }
    }, [isLogin, navigate]);

    function submit() {
        if (tagname === text) {
            navigate(`/profile/${uid}`);
            return;
        }
        if (text.length === 0) {
            setCommentCorrect(false);
            setCommentErrorMessage("Error: tag cannot be empty");
            return;
        }
        if (text.length > 10) {
            setCommentCorrect(false);
            setCommentErrorMessage("Error: tag cannot be more than 10 characters");
            return;
        }
        Axios.patch(`${expressServer}/profile/tags/${tid}`, { newTagName: text })
            .then(res => {
                navigate(`/profile/${uid}`)
            }).catch(err => {
                console.log(err);
            });
        return;
    }

    function deleteTag() {
        Axios.delete(`${expressServer}/profile/tags/${tid}`)
            .then(res => {
                navigate(`/profile/${uid}`);
            })
            .catch(err => {
                console.log(err);
            })
        return;
    }

    return (
        <div className='page-wrapper new-comments-page-wrapper'>
            <div className='question-section-wrapper'>
                <div className='question-section-title bold'>Tag<span>*</span></div>
                <div className='question-section-note'>min. 1 character, max. 10 characters</div>
                <input className='question-section-input' type="text" defaultValue={text} onChange={(e) => { setText(e.target.value.trim()) }} />
                <div className='question-section-error'>{commentCorrect ? "" : commentErrorMessage}</div>
            </div>
            <div className='question-button-wrapper'>
                <button className='submit-button bold delete-bttn' onClick={deleteTag}>Delete</button>
                <div className='dummy'></div>
                <button className='submit-button bold' onClick={submit}>Submit</button>
            </div>
        </div>
    )
}

export default EditTags;
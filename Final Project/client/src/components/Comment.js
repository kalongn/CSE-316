import { useState, useContext } from 'react';
import { LoginContext } from '../App';

import { timeElapsedDisplay } from '../helper';

import '../stylesheets/general.css';
import '../stylesheets/components/Comment.css'

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function Comment(props) {
    const { isLogin } = useContext(LoginContext);
    const { comment, setDataFetchSuccess} = props;
    const [currentVote, setCurrentVote] = useState(comment.vote);

    function handleUpVote() {
        if (!isLogin) {
            alert("You need to login to vote");
            return;
        }
        setCurrentVote(currentVote + 1)
        Axios.patch(`${expressServer}/comment/vote`, { cid: comment._id })
            .then(res => {
                setDataFetchSuccess(1);
            })
            .catch(err => {
                console.log(err);
                setDataFetchSuccess(0);
            })
    }

    return (
        <div className="comment-wrapper">
            <div className='comment-answers-votes'>
                <button onClick={handleUpVote}>⬆</button>
                <div>{currentVote}</div>
            </div>
            <div className="comment-text">{comment.text} - <span>{comment.com_by.username}</span> <span className='comment-time'>commented {timeElapsedDisplay(comment.com_date_time)}</span></div>
        </div>
    )
}
export default Comment;
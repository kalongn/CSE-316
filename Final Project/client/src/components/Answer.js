import { useContext, useState } from 'react';
import { LoginContext } from '../App';

import Comments from './Comments';

import { timeElapsedDisplay, detectHyperLinks } from '../helper';

import '../stylesheets/general.css';
import '../stylesheets/components/Answer.css';

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function Answer(props) {
    const { isLogin } = useContext(LoginContext);
    const { answer, qid, setDataFetchSuccess, user } = props;
    const [currentVote, setCurrentVote] = useState(answer.vote);

    function handleUpVote() {
        if (!isLogin) {
            alert("You need to login to vote");
            return;
        }
        if (user.reputation < 50) {
            alert("You need 50 reputation to vote");
            return;
        }
        setCurrentVote(currentVote + 1)
        Axios.patch(`${expressServer}/answer/vote`, { voteType: 1, aid: answer._id, uid: answer.ans_by._id })
            .then(res => {
                setDataFetchSuccess(1);
            })
            .catch(err => {
                console.log(err);
                setDataFetchSuccess(0);
            })
    }

    function handleDownVote() {
        if (!isLogin) {
            alert("You need to login to vote");
            return;
        }
        if (user.reputation < 50) {
            alert("You need 50 reputation to vote");
            return;
        }
        setCurrentVote(currentVote - 1)
        Axios.patch(`${expressServer}/answer/vote`, { voteType: 0, aid: answer._id, uid: answer.ans_by._id })
            .then(res => {
                setDataFetchSuccess(1);
            })
            .catch(err => {
                console.log(err);
                setDataFetchSuccess(0);
            })
    }

    function replaceHyperLink(text) {
        const regex = /\[([^\]]+)\]\( *(https?:\/\/[^\s)]*) *\)/;
        let item = detectHyperLinks(text);
        let result = text;
        item.forEach(eachMatch => {
            result = result.replace(regex, `<a class="inline-a-tag" href=${eachMatch.url} target="_blank">${eachMatch.linkText}</a>`);
        })
        return result;
    }

    return (
        <div className='answer-container'>
            <div className="answer-wrapper">
                <div className='answers-votes'>
                    <button onClick={handleUpVote}>⬆</button>
                    <div>{currentVote}</div>
                    <button onClick={handleDownVote}>⬇</button>
                </div>
                <div className='answers-text' dangerouslySetInnerHTML={{ __html: replaceHyperLink(answer.text) }}></div>
                <div className='answers-stat'><span>{answer.ans_by.username}</span> answered {timeElapsedDisplay(answer.ans_date_time)} </div>
            </div>
            <Comments type={"answer"} id={answer._id} qid={qid} comments={answer.comments} setDataFetchSuccess={setDataFetchSuccess} />
        </div>
    )
}
export default Answer;
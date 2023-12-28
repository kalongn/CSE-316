import { useContext, useState } from 'react';
import { LoginContext } from '../App';
import { detectHyperLinks } from '../helper';

import Comments from './Comments';

import '../stylesheets/general.css';
import '../stylesheets/components/AnswersMainContent.css';

import Axios from 'axios';
const expressServer = "http://localhost:8000";


function AnswerMainContent(props) {
    const { isLogin } = useContext(LoginContext);
    const { question, setQuestion, user, setDataFetchSuccess } = props;

    const [questionVote, setQuestionVote] = useState(question.vote);
    // const [upVoted, setupVoted] = useState(false);
    // const [downVoted, setdownVoted] = useState(false);

    function handleUpVote() {
        if (!isLogin) {
            alert("You need to login to vote");
            return;
        }
        if (user.reputation < 50) {
            alert("You need 50 reputation to vote");
            return;
        }
        // if (upVoted) {
        //     return;
        // }
        let increment = 0;
        // if (downVoted) {
        //     increment = 1;
        //     Axios.patch(`${expressServer}/question/undoVote`, { voteType: 0, qid: question._id, uid: question.asked_by._id })
        //         .then(res => {
        //             setQuestion(res.data);
        //             setDataFetchSuccess(1);
        //         })
        //         .catch(err => {
        //             console.log(err);
        //             setDataFetchSuccess(0);
        //         })
        // }
        setQuestionVote(questionVote + 1 + increment)
        // setupVoted(true);
        // setdownVoted(false);
        Axios.patch(`${expressServer}/question/vote`, { voteType: 1, qid: question._id, uid: question.asked_by._id })
            .then(res => {
                setQuestion(res.data);
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
        // if (downVoted) {
        //     return;
        // }
        let decrement = 0;
        // if (upVoted) {
        //     decrement = -1;
        //     Axios.patch(`${expressServer}/question/undoVote`, { voteType: 1, qid: question._id, uid: question.asked_by._id })
        //         .then(res => {
        //             setQuestion(res.data);
        //             setDataFetchSuccess(1);
        //         })
        //         .catch(err => {
        //             console.log(err);
        //             setDataFetchSuccess(0);
        //         })
        // }
        setQuestionVote(questionVote - 1 + decrement)
        // setupVoted(false);
        // setdownVoted(true);
        Axios.patch(`${expressServer}/question/vote`, { voteType: 0, qid: question._id, uid: question.asked_by._id })
            .then(res => {
                setQuestion(res.data);
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
        <div className='answers-main-content-wrapper'>
            <div className='answers-text-content-wrapper'>
                <div className='answers-votes'>
                    <button onClick={handleUpVote}>⬆</button>
                    <div>{questionVote}</div>
                    <button onClick={handleDownVote}>⬇</button>
                </div>

                <div className='answers-text' dangerouslySetInnerHTML={{ __html: replaceHyperLink(question.text) }} />
            </div>
            <Comments type={"question"} id={question._id} qid={question._id} comments={question.comments} setDataFetchSuccess={setDataFetchSuccess} />
        </div>
    )
}

export default AnswerMainContent;
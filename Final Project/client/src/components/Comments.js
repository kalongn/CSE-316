import { useState, useEffect } from 'react';
import { sortCommentsByLatest, createGroup } from '../helper';

import AddComment from './AddComment';
import Comment from './Comment';

import '../stylesheets/general.css';
import '../stylesheets/components/Comments.css';

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function Comments(props) {
    const { type, id, qid, comments, setDataFetchSuccess } = props;
    const [allComment, setAllComment] = useState([]);
    const [currentComment, setCurrentComment] = useState([]);
    const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

    useEffect(() => {
        Axios.get(`${expressServer}/comments`, { params: { ids: comments.map(comment => comment._id) } })
            .then(res => {
                setAllComment(sortCommentsByLatest(res.data));
                setDataFetchSuccess(1);
            })
            .catch(err => {
                console.log(err);
                setDataFetchSuccess(0);
            })
    }, [comments, setDataFetchSuccess]);

    useEffect(() => {
        const currentDisplay = createGroup(allComment, 3);
        setCurrentComment(currentDisplay)
        setCurrentCommentIndex(0);
    }, [allComment]);

    const handlePrevButton = () => {
        if (currentCommentIndex > 0) {
            setCurrentCommentIndex(currentCommentIndex - 1);
        }
    }
    const handleNextButton = () => {
        if (currentCommentIndex < currentComment.length - 1) {
            setCurrentCommentIndex(currentCommentIndex + 1);
        }
    }


    return (
        <div className='comments-wrapper'>
            <div className='comments-header-stat'>
                <div className='bold'>{comments.length} comments</div>
                <div className='dummy'></div>
                <AddComment type={type} id={id} qid={qid} />
            </div>
            <div className='comments-list'>
                {currentComment.length > 0 && currentComment[currentCommentIndex].map(comment => <Comment key={comment._id} comment={comment} setDataFetchSuccess={setDataFetchSuccess} />)}
            </div>
            {currentComment.length > 0 && <div className='comments-prev-next-wrapper'>
                <button onClick={handlePrevButton}>prev</button>
                <div>Page <span>{currentCommentIndex + 1}</span></div>
                <button onClick={handleNextButton}>next</button>
            </div>}
        </div>
    )
}

export default Comments;
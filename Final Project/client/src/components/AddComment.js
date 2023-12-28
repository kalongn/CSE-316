import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../App';

import '../stylesheets/general.css';
import '../stylesheets/components/AddComment.css'

function AddComment(props) {
    const { isLogin } = useContext(LoginContext);
    const { type, id, qid } = props;

    return (
        <>
            {isLogin ? <Link className='add-comment-bttn' to={`/newcomments/${type}/${id}/${qid}`}>Add Comment</Link> : <Link className='add-comment-bttn invis'>Add Comment</Link>}
        </>
    )
}

export default AddComment;
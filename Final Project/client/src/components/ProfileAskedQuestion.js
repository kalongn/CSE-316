import '../stylesheets/general.css';

import { Link } from 'react-router-dom';

function ProfileAskedQuestion(props) {
    const { question, uid } = props;
    return (
        <div className="profile-item-wrapper">
            <div className='profile-item-number'>{question.vote} vote(s)</div>
            <div className="profile-item-text">{question.title}</div>
            <div className='profile-item-buttons-wrapper'>
                <Link to={`/editquestion/${question._id}/${uid}`} className='profile-item-button'>Edit/Delete</Link>
            </div>
        </div>
    )
}

export default ProfileAskedQuestion;
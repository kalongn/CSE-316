import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import '../stylesheets/general.css';
import '../stylesheets/components/ProfileItem.css'
import '../stylesheets/components/EditItems.css'

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function ProfileAnsweredQuestion(props) {
    const { question, uid } = props;
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        Axios.get(`${expressServer}/profile/answers`, { params: { qid: question._id, uid } })
            .then(res => {
                setAnswers(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [question._id, uid]);

    return (
        <div className="profile-answer-wrapper">
            <div className="profile-item-wrapper">
                <div className='profile-item-number'>From Question: </div>
                <div className="profile-item-text">{question.title}</div>
            </div>
            <div className="profile-answers-wrapper">
                {answers.map(answer =>
                    <div className="profile-answer-item" key={answer._id}>
                        <div className="profile-answer-vote">Answer: </div>
                        <div className="profile-answer-text">{answer.text}</div>
                        <div className='profile-item-buttons-wrapper'>
                            <Link to={`/editanswer/${answer._id}/${answer.text}/${question._id}/${uid}`} className='profile-item-button'>Edit/Delete</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileAnsweredQuestion;
import { useEffect, useState } from 'react';

import ProfileAskedQuestion from './ProfileAskedQuestion';
import ProfileTag from './ProfileTag';
import ProfileAnsweredQuestion from './ProfilleAnsweredQuestion';
import ProfileUser from './ProfileUser';

import { sortQuestionByLatest, createGroup } from '../helper';

import '../stylesheets/general.css';
import '../stylesheets/components/ProfileSection.css';

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function ProfileSection(props) {
    const { username, type, uid, setDataFetchSuccess } = props;

    const [askedQuestions, setAskedQuestions] = useState([]);
    const [usedTags, setUsedTags] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [allUser, setAllUser] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [currentPageCotent, setCurrentPageContent] = useState([]);

    useEffect(() => {

        async function fetchQuestionsAsked() {
            try {
                const res = await Axios.get(`${expressServer}/profile/askedquestions`, { params: { uid: uid } })
                setAskedQuestions(sortQuestionByLatest(res.data));
            } catch (error) {
                console.log(error);
                setDataFetchSuccess(0);
            }
        }

        async function fetchTags() {
            try {
                const res = await Axios.get(`${expressServer}/profile/tags`, { params: { uid: uid } })
                setUsedTags(res.data);
            } catch (error) {
                console.log(error);
                setDataFetchSuccess(0);
            }
        }

        async function fetchQuestionsAnswered() {
            try {
                const res = await Axios.get(`${expressServer}/profile/answeredquestions`, { params: { uid: uid } })
                setAnsweredQuestions(sortQuestionByLatest(res.data));
            } catch (error) {
                console.log(error);
                setDataFetchSuccess(0);
            }
        }

        async function fetchAllUser() {
            try {
                const res = await Axios.get(`${expressServer}/profile/users`)
                setAllUser(res.data);
            } catch (error) {
                console.log(error);
                setDataFetchSuccess(0);
            }
        }

        switch (type) {
            case 'Asked-questions':
                fetchQuestionsAsked();
                break;
            case 'Used-tags':
                fetchTags();
                break;
            case 'Answered-questions':
                fetchQuestionsAnswered();
                break;
            case 'Admin-User':
                fetchAllUser();
                break;
            default:
                break;
        }
    }, [setDataFetchSuccess, type, uid])

    function handlePrevButton() {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1);
        }
    }
    function handleNextButton() {
        if (currentPageIndex < currentPageCotent.length - 1) {
            setCurrentPageIndex(currentPageIndex + 1);
        }
    }

    useEffect(() => {
        let currentDisplay;
        switch (type) {
            case 'Asked-questions':
                currentDisplay = createGroup(askedQuestions, 5);
                setCurrentPageContent(currentDisplay)
                setCurrentPageIndex(0);
                break;
            case 'Used-tags':
                currentDisplay = createGroup(usedTags, 3);
                setCurrentPageContent(currentDisplay)
                setCurrentPageIndex(0);
                break;
            case 'Answered-questions':
                currentDisplay = createGroup(answeredQuestions, 5);
                setCurrentPageContent(currentDisplay)
                setCurrentPageIndex(0);
                break;
            case 'Admin-User':
                currentDisplay = createGroup(allUser, 5);
                setCurrentPageContent(currentDisplay)
                setCurrentPageIndex(0);
                break;
            default:
                break;
        }
    }, [askedQuestions, usedTags, answeredQuestions, type, allUser])

    function renderSwitch() {
        switch (type) {
            case 'Asked-questions':
                return currentPageCotent.length > 0
                    ? currentPageCotent[currentPageIndex].map(item => <ProfileAskedQuestion key={item._id} question={item} uid={uid} />)
                    : <div className='no-content-avaliable'>You've not ask a question yet.</div>
            case 'Used-tags':
                return currentPageCotent.length > 0
                    ? currentPageCotent[currentPageIndex].map(item => <ProfileTag key={item._id} tag={item} uid={uid} />)
                    : <div className='no-content-avaliable'>You've not use a tag yet</div>
            case 'Answered-questions':
                return currentPageCotent.length > 0
                    ? currentPageCotent[currentPageIndex].map(item => <ProfileAnsweredQuestion key={item._id} question={item} uid={uid} />)
                    : <div className='no-content-avaliable'>You've not answer a question yet.</div>
            case 'Admin-User':
                return currentPageCotent.length > 0
                    ? currentPageCotent[currentPageIndex].map(item => <ProfileUser key={item._id} user={item} />)
                    : <div className='no-content-avaliable'>No Users Found</div>
            default:
                return <></>
        }
    }

    return (
        <div className="profile-section">
            <div className="profile-section-header">
                <h2>{type} {type === 'Admin-User' ? <span>Admin: {username} </span> : ""}</h2>
            </div>
            <div className="profile-section-content">
                {renderSwitch()}
            </div>
            {currentPageCotent.length > 0 && <div className='profile-prev-next-wrapper'>
                <button onClick={handlePrevButton}>prev</button>
                <div>Page <span>{currentPageIndex + 1}</span></div>
                <button onClick={handleNextButton}>next</button>
            </div>}
        </div>
    )
}

export default ProfileSection;
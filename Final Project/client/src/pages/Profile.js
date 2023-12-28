import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { LoginContext } from '../App'

import ProfileSection from '../components/ProfileSection'
import { timeElapsedDisplay } from '../helper'

import '../stylesheets/general.css'
import '../stylesheets/pages/Profile.css'

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function Profile() {
    const { isLogin } = useContext(LoginContext);
    const navigate = useNavigate();
    const { uid } = useParams();

    const [user, setUser] = useState({});
    const [displayUser, setDisplayUser] = useState({});
    const [dataFetchSuccess, setDataFetchSuccess] = useState(1);

    useEffect(() => {
        if (!isLogin) {
            navigate("/");
            return;
        }
        Axios.get(`${expressServer}/user`, { withCredentials: true })
            .then(res => {
                setUser(res.data);
                setDataFetchSuccess(1);
                if (res.data.permission === 'ADMIN') {
                    Axios.get(`${expressServer}/user/${uid}`, { withCredentials: true })
                        .then(res => {
                            setDisplayUser(res.data);
                            setDataFetchSuccess(1);
                        })
                        .catch(err => {
                            console.log(err);
                            setDataFetchSuccess(0);
                        });
                } else {
                    setDisplayUser(res.data);
                }
            })
            .catch(err => {
                console.log(err);
                setDataFetchSuccess(0);
            });
    }, [isLogin, navigate, uid]);

    return (
        <div className='page-wrapper profile-page-wrapper'>
            {dataFetchSuccess ?
                <>
                    <div className='profile-info-wrapper'>
                        <div className='profile-info-name big-font bold'>Profile of <span>{displayUser.username}</span></div>
                        <div className='profile-info-item'>
                            <div>Member since {timeElapsedDisplay(displayUser.member_since)}</div>
                            <div>Reputation: {displayUser.reputation}</div>
                        </div>
                    </div>
                    <div className='profile-display-content-wrapper'>
                        <ProfileSection type={"Asked-questions"} uid={uid} setDataFetchSuccess={setDataFetchSuccess} />
                        <ProfileSection type={"Used-tags"} uid={uid} setDataFetchSuccess={setDataFetchSuccess} />
                        <ProfileSection type={"Answered-questions"} uid={uid} setDataFetchSuccess={setDataFetchSuccess} />
                        {user.permission === 'ADMIN' ? <ProfileSection type={"Admin-User"} username={user.username} uid={uid} setDataFetchSuccess={setDataFetchSuccess} /> : <></>}
                    </div>
                </>
                :
                <>
                    <div className='big-font'>An Error Occured</div>
                    <Link className={"link med-font"} to='/'>
                        <div style={{ padding: 32 }}><span>Click Here to return to home page</span></div>
                    </Link>
                </>}
        </div>
    )
}

export default Profile
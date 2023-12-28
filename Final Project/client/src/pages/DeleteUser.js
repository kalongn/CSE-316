import { useState, useEffect, useContext } from 'react'
import { LoginContext } from '../App'
import { useParams, useNavigate } from 'react-router-dom'

import '../stylesheets/general.css';
import '../stylesheets/pages/NewQuestions.css'
import '../stylesheets/pages/DeleteUser.css'

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function DeleteUser(props) {
    const { setIsLogin } = props;
    const { isLogin } = useContext(LoginContext);
    const navigate = useNavigate();
    const { urep, username, uid } = useParams();
    const [currentUser, setCurrentUser] = useState();
    const [popUp, setPopUp] = useState(false);

    async function deleteUser() {
        await Axios.delete(`${expressServer}/profile/user/${uid}`, { withCredentials: true });
        if (uid === currentUser.uid) {
            await Axios.get(`${expressServer}/logout`, { withCredentials: true });
            setIsLogin(false);
        }
        navigate("/");
        return;
    }

    useEffect(() => {
        if (!isLogin) {
            navigate("/");
            return;
        }
        Axios.get(`${expressServer}/user`, { withCredentials: true })
            .then(res => {
                setCurrentUser(res.data);
                if (res.data.permission !== "ADMIN") {
                    navigate("/");
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, [isLogin, navigate, setCurrentUser])

    return (
        <div className='page-wrapper delete-page-wrapper'>
            <h1>User: <span>{username}</span>, Reputation: <span>{urep}</span> </h1>
            <div>
                <button className='submit-button bold' onClick={() => setPopUp(true)}>Delete</button>
            </div>
            {popUp && <div className='pop-up-confirm'>
                <h1>Are you 100% sure?</h1>
                <h2>This action is irreversible</h2>
                <div className='question-button-wrapper'>
                    <button className='submit-button bold cancel' onClick={() => setPopUp(false)}>Cancel</button>
                    <button className='submit-button bold delete' onClick={deleteUser}>Yes</button>
                </div>
            </div>}
        </div>
    )
}

export default DeleteUser;
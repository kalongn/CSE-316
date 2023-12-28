import Axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/general.css';
import '../stylesheets/pages/LoginAndSignUp.css';

const expressServer = "http://localhost:8000";

function SignUp() {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [wrongInputStyle, setWrongInputStyle] = useState("wrong-input");
    const [wrongInputText, setWrongInputText] = useState("Invalid input for email");
    const navigate = useNavigate();

    async function signUp(e, username, email, password) {
        e.preventDefault();
        try {
            await Axios.post(`${expressServer}/signup`, { username: username, email: email, password: password }, { withCredentials: true });
            setWrongInputStyle("wrong-input");
            navigate("/login");
        } catch (err) {
            setWrongInputStyle("wrong-input visible");
            setWrongInputText("Server error");
            if (err.response.status === 401) {
                setWrongInputText("Error: Invalid input for email");
            }
        } finally {
            setUserName("");
            setEmail("");
            setPassword("");
        }
        return;
    }

    return (
        <div className='page-wrapper content-wrapper'>
            <div className='card'>
                <h1>Sign up</h1>
                <form className={'.med-font'} onSubmit={(e) => signUp(e, username, email, password)}>
                    <input type="text" name="username" autoComplete="off" placeholder="Username" value={username} onChange={(e) => setUserName(e.target.value)} />
                    <input type="text" name="email" autoComplete="off" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" name="pw" autoComplete="off" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className={wrongInputStyle}>{wrongInputText}</div>
                    <button>Sign up</button>
                </form>
            </div>
        </div >
    );
}

export default SignUp;
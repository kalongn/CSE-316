import Axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/general.css';
import '../stylesheets/pages/LoginAndSignUp.css';

const expressServer = "http://localhost:8000";

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [wrongInputStyle, setWrongInputStyle] = useState("wrong-input");
    const [wrongInputText, setWrongInputText] = useState("Invalid Email or password");
    const navigate = useNavigate();

    async function login(e, email, password) {
        e.preventDefault();
        try {
            await Axios.post(`${expressServer}/login`, { email: email, password: password }, { withCredentials: true });
            props.setIsLogin(true);
            setWrongInputStyle("wrong-input");
            navigate("/questions");
        } catch (err) {
            setWrongInputStyle("wrong-input visible");
            setWrongInputText("Error: Server error")
            if (err.response.status === 401) {
                setWrongInputText("Error: Invalid Email or password");
            }
        } finally {
            setEmail("");
            setPassword("");
        
        }
        return;
    }

    return (
        <div className='page-wrapper content-wrapper'>
            <div className='card'>
                <h1>Login</h1>
                <form className={'.med-font'} onSubmit={(e) => login(e, email, password)}>
                    <input type="text" name="email" autoComplete="off" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" name="pw" autoComplete="off" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className={wrongInputStyle}>{wrongInputText}</div>
                    <button>Login</button>
                </form >
            </div>
        </div>
    );
}

export default Login;
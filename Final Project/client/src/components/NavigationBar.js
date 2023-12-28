import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../App';

import '../stylesheets/components/NavigationBar.css'
import '../stylesheets/general.css'

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function NavigationBar(props) {
    const [searchParam, setSearchParam] = useSearchParams({ param: "" });
    const { isLogin } = useContext(LoginContext);
    const navigate = useNavigate();

    const [user, setUser] = useState({});

    async function logout(e) {
        e.preventDefault();
        try {
            await Axios.get(`${expressServer}/logout`, { withCredentials: true });
            props.setIsLogin(false);
        } catch (err) {
            alert("There's an error logging out");
        }
        navigate("/");
        return;
    }

    useEffect(() => {
        if (!isLogin) {
            return;
        }
        Axios.get(`${expressServer}/user`, { withCredentials: true })
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [isLogin, navigate]);

    return (
        <header>
            <div className='orange-bar'></div>
            <div className='nav-bar-wrapper'>
                <Link className={"link home-button"} to='/'>
                    <div><span>fake</span> Stack<strong>Overflow</strong></div>
                </Link>
                <div className='button-wrapper'>
                    <Link className={"link"} to='/questions'>
                        <div>Questions</div>
                    </Link>
                    <Link className={"link"} to='/tags'>
                        <div>Tags</div>
                    </Link>
                </div>
                <form className={"search-bar"} onSubmit={() => navigate(`/search/${searchParam}`)}>
                    <input type='text' autoComplete="off" placeholder='Search' value={searchParam.get('param')} onChange={(e) => setSearchParam({ param: e.target.value })} />
                </form>
                <div className='button-wrapper'>
                    {isLogin ?
                        <>
                            <Link className={"link"} to={`/profile/${user._id}`}>
                                <div>Profile</div>
                            </Link>
                            <Link className={"link"} onClick={e => logout(e)} to='/'>
                                <div>Logout</div>
                            </Link>
                        </>
                        :
                        <>
                            <Link className={"link"} to='/login'>
                                <div>Login</div>
                            </Link>
                            <Link className={"link sign-up"} to='/signup'>
                                <div>Sign up</div>
                            </Link >
                        </>
                    }
                </div>
            </div>
            <div className='grey-bar'></div>
        </header>
    );
}

export default NavigationBar;
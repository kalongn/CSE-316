import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LoginContext } from '../App';

import AnswersHeader from '../components/AnswersHeader';
import AnswersMainContent from '../components/AnswersMainContent';
import AnswersList from '../components/AnswersList';

import '../stylesheets/general.css';
import '../stylesheets/pages/Answers.css';

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function Answers() {
    const { isLogin } = useContext(LoginContext);
    const { questionId, uid} = useParams();
    const [question, setQuestion] = useState({});
    const [views, setViews] = useState(0);
    const [user, setUser] = useState({});
    const [dataFetchSuccess, setDataFetchSuccess] = useState(1);
    

    // this ran twice due to react strictMode
    useEffect(() => {
        Axios.patch(`${expressServer}/question`, { id: questionId })
            .then(res => {
                setQuestion(res.data);
                setViews(res.data.views);
                setDataFetchSuccess(1);
            })
            .catch(err => {
                console.log(err);
                setDataFetchSuccess(0);
            })
    }, [questionId])

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

    }, [isLogin]);

    return (
        <div className='page-wrapper answer-page-wrapper'>
            {dataFetchSuccess === 1 && JSON.stringify(question) !== '{}' ?
                <>
                    <AnswersHeader question={question} views={views} setViews={setViews} />
                    <AnswersMainContent question={question} setQuestion={setQuestion} user={user} setDataFetchSuccess={setDataFetchSuccess} />
                    <AnswersList qid={question._id} answers={question.answers} setDataFetchSuccess={setDataFetchSuccess} user={user} uid={uid} />
                </>
                :
                <>
                    <div className='big-font'>An Error Occured</div>
                    <Link className={"link med-font"} to='/'>
                        <div style={{ padding: 32 }}><span>Click Here to return to home page</span></div>
                    </Link>
                </>
            }
        </div>
    )
}

export default Answers;
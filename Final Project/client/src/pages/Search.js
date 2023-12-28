import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import QuestionsHeader from '../components/QuestionsHeader';
import QuestionsList from '../components/QuestionsList';

import '../stylesheets/general.css';
import '../stylesheets/pages/Search.css'

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function Search() {

    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [sortType, setSortType] = useState('Newest');
    const [dataFetchSuccess, setDataFetchSuccess] = useState(1);
    const title = "Search Result";

    let { param } = useParams();
    param = param.split('=')[1] || '';
    if (param.length === 0) {
        navigate('/questions');
    }

    useEffect(() => {
        let wordsArray = param.match(/\b(?:\w+(?!\]))+\b/g) || [];
        let tagsArray = param.match(/\[([^\]]+)]/g) || [];
        tagsArray = tagsArray.map(tag => tag.substring(1, tag.length - 1));
        Axios.get(`${expressServer}/questions`)
            .then(res => {
                setQuestions(questionsContainParam(res.data, wordsArray, tagsArray))
            })
            .catch(err => {
                console.log(err);
                setDataFetchSuccess(0);
            });
    }, [param])

    function questionsContainParam(questions, wordParam, tagParam) {
        const keyWordquestions = (wordParam.length > 0 && questions.filter(question => wordParam.some(keyword => (question.title + " " + question.text + " " + question.summary).indexOf(keyword) !== -1))) || [];
        const tagQuestions = (tagParam.length > 0 && questions.filter(question => tagParam.some(tag => question.tags.some(qtag => qtag.name === tag.toLowerCase())))) || [];
        let questionsSelected = keyWordquestions.concat(tagQuestions);
        questionsSelected = questionsSelected.filter((question, index) => {
            return index === questionsSelected.findIndex(q => question._id === q._id);
        });
        return questionsSelected;
    }


    return (
        <div className='page-wrapper search-page-wrapper'>
            {dataFetchSuccess ?
                <>
                    <QuestionsHeader setSortType={setSortType} title={title} questionsLength={questions.length} />
                    {questions.length > 0 ? <QuestionsList questions={questions} sortType={sortType} /> : <div className='big-font bold no-result-padding'>No results found</div>}
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

export default Search;
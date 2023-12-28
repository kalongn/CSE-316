import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import QuestionsHeader from '../components/QuestionsHeader';
import QuestionsList from '../components/QuestionsList';

import '../stylesheets/general.css';
import '../stylesheets/pages/Questions.css';

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function Questions() {
    const { tagName } = useParams();

    const [questions, setQuestions] = useState([]);
    const [sortType, setSortType] = useState('Newest');
    const [dataFetchSuccess, setDataFetchSuccess] = useState(1);
    const [title, setTitle] = useState("All Questions")

    useEffect(() => {
        tagName ? setTitle(`Questions tagged [${tagName}]`) : setTitle("All Questions");
        Axios.get(`${expressServer}/questions`)
            .then(res => {
                setQuestions(tagName ? QuestionsContainsTag(res.data, tagName) : res.data);
                setDataFetchSuccess(1);
            })
            .catch(err => {
                console.log(err);
                setDataFetchSuccess(0);
            });
    }, [tagName])

    function QuestionsContainsTag(questions, tag) {
        const questionsWithTag = questions.filter(question => question.tags.some(qtag => qtag.name === tag));
        return questionsWithTag;
    }
    return (
        <div className="page-wrapper question-page-wrapper">
            {dataFetchSuccess ?
                <>
                    <QuestionsHeader setSortType={setSortType} title={title} questionsLength={questions.length} />
                    <QuestionsList questions={questions} sortType={sortType} />
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

export default Questions;
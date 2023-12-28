import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import '../stylesheets/general.css';
import '../stylesheets/components/Tag.css'
import '../stylesheets/components/QuestionTag.css'

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function Tag(props) {
    const { tag, setDataFetchSuccess } = props;
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        Axios.get(`${expressServer}/questions`)
            .then(res => {
                setQuestions(QuestionsContainsTag(res.data, tag))
                setDataFetchSuccess(1);
            })
            .catch(err => {
                console.log(err);
                setDataFetchSuccess(0);
            });
    }, [setDataFetchSuccess, tag])

    function QuestionsContainsTag(questions, tag) {
        return questions.filter(question => question.tags.some(qtag => qtag.name === tag.name));
    }

    return (
        <div className="tag-container">
            <Link className={"tag-wrapper"} to={`/questions/${tag.name}`}>
                <div>{tag.name}</div>
            </Link>
            <div className='dummy'></div>
            <div className="tag-statistics-wrapper">
                <div className="tag-questions-length">{questions.length} questions</div>
                <div className='dummy'></div>
                <div className="tag-used_by-count"> {tag.used_by.length} user(s) used</div>
            </div>
        </div>
    )
}

export default Tag;
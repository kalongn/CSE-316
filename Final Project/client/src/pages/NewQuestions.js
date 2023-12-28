import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../App';


import '../stylesheets/general.css';
import '../stylesheets/pages/NewQuestions.css'

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function NewQuestions() {
    const { isLogin } = useContext(LoginContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [text, setText] = useState("");
    const [tags, setTags] = useState("");
    const [currentUser, setCurrentUser] = useState({});

    const [titleCorrect, setTitleCorrect] = useState(true);
    const [titleErrorMessage, setTitleErrorMessage] = useState("");
    const [summaryCorrect, setSummaryCorrect] = useState(true);
    const [summaryErrorMessage, setSummaryErrorMessage] = useState("");
    const [textCorrect, setTextCorrect] = useState(true);
    const [textErrorMessage, setTextErrorMessage] = useState("");
    const [tagsCorrect, setTagsCorrect] = useState(true);
    const [tagsErrorMessage, setTagsErrorMessage] = useState("");

    const validTags = [];


    useEffect(() => {
        if (!isLogin) {
            navigate("/");
            return;
        }
        Axios.get(`${expressServer}/user`, { withCredentials: true })
            .then(res => {
                setCurrentUser(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [isLogin, navigate]);

    function validateHyperLink(text) {
        const regex = /\[([^\]]+)\]\(([^\s)]*)\)/g;
        const allResults = [...text.matchAll(regex)];
        if (allResults.length !== 0) {
            for (const result of allResults) {
                if (result[2] === "") {
                    setTextErrorMessage('Error: link cannot be empty');
                    return false;
                }
                if (result[2].indexOf("http://") !== 0 && result[2].indexOf("https://") !== 0) {
                    setTextErrorMessage('Error: link must start with http:// or https://');
                    return false;
                }
            }
        }
        return true;
    }

    function validateTags(tags) {
        if (tags.length === 0) {
            setTagsCorrect(false);
            setTagsErrorMessage("Error: Tags cannot be empty");
            return false;
        }
        const tagsArray = tags.split(" ");
        if (tagsArray.length > 5) {
            setTagsErrorMessage("Error: Maximum 5 tags");
            return false;
        }
        for (const tag of tagsArray) {
            if (tag.length > 10) {
                setTagsErrorMessage("Error: Maximum 10 characters in a tag");
                return false;
            }
            validTags.push(tag);
        }
        return true;
    }

    async function submit() {
        setTitleCorrect(true);
        setSummaryCorrect(true);
        setTextCorrect(true);
        setTagsCorrect(true);

        let isValid = true;

        if (title.length < 1 || title.length > 50) {
            setTitleCorrect(false);
            setTitleErrorMessage("Error: Title must be 1-50 characters");
            isValid = false;
        }
        if (summary.length < 1 || summary.length > 140) {
            setSummaryCorrect(false);
            setSummaryErrorMessage("Error: Summary must be 1-140 characters");
            isValid = false;
        }
        if (text.length < 1) {
            setTextCorrect(false);
            setTextErrorMessage("Error: Text cannot be empty");
            isValid = false;
        }
        if (!validateHyperLink(text)) {
            setTextCorrect(false);
            isValid = false;
        }
        if (!validateTags(tags)) {
            setTagsCorrect(false);
            isValid = false;
        }
        if (!isValid) return;
        let { existTags, newTags } = (await Axios.get(`${expressServer}/newquestionstags`, { params: { tags: validTags } })).data;

        for (let tag of existTags) {
            if (tag.used_by.includes(currentUser._id)) {
                continue;
            }
            tag.used_by.push(currentUser._id);
        }
        if (currentUser.reputation < 50 && newTags.length > 0) {
            setTagsCorrect(false);
            setTagsErrorMessage("Error: You need at least 50 reputation to create a new Tag");
            return;
        }
        await Axios.patch(`${expressServer}/tags`, { tags: existTags });
        const existTagID = existTags.map(tag => tag._id);
        const { newTagID } = (await Axios.post(`${expressServer}/newtags`, { tags: newTags, user: currentUser._id })).data;
        const allTagsID = [...existTagID, ...newTagID];

        await Axios.post(`${expressServer}/newquestion`, { title, summary, text, tags: allTagsID, user: currentUser._id });
        navigate("/questions");
        return;
    }

    return (
        <div className='page-wrapper new-question-page-wrapper'>
            <div className='question-section-wrapper'>
                <div className='question-section-title bold'>Titles<span>*</span></div>
                <div className='question-section-note'>min. 1 character, max. 50 characters</div>
                <input className='question-section-input' type="text" placeholder='e.g. How to Pass CSE 316 Fundamental Of Software Development' onChange={(e) => { setTitle(e.target.value.trim()) }} />
                <div className='question-section-error'>{titleCorrect ? "" : titleErrorMessage}</div>
            </div>
            <div className='question-section-wrapper'>
                <div className='question-section-title bold'>Summary<span>*</span></div>
                <div className='question-section-note'>min. 1 character, max. 140 characters</div>
                <textarea className='question-section-input' type="text" rows={3} onChange={(e) => { setSummary(e.target.value.trim()) }} />
                <div className='question-section-error'>{summaryCorrect ? "" : summaryErrorMessage}</div>
            </div>
            <div className='question-section-wrapper'>
                <div className='question-section-title bold'>Text<span>*</span></div>
                <div className='question-section-note'>Description of your question</div>
                <textarea className='question-section-input' type="text" rows={6} onChange={(e) => { setText(e.target.value.trim()) }} />
                <div className='question-section-error'>{textCorrect ? "" : textErrorMessage}</div>
            </div>
            <div className='question-section-wrapper'>
                <div className='question-section-title bold'>Tags<span>*</span></div>
                <div className='question-section-note'>max. 5 tags (seperate tags by whitespace), each tag min. 1 character, max. 10 characters</div>
                <input className='question-section-input' type="text" placeholder='e.g. react javascript stonybrook' onChange={(e) => { setTags(e.target.value.trim()) }} />
                <div className='question-section-error'>{tagsCorrect ? "" : tagsErrorMessage}</div>
            </div>
            <button className='submit-button bold' onClick={submit}>Submit</button>
        </div>
    )
}

export default NewQuestions;
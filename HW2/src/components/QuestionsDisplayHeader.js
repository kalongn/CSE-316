import '../stylesheets/App.css';
import '../stylesheets/QuestionsDisplayHeader.css';

import { useEffect, useState } from 'react';
import { sortQuestionByLatest, sortQuestionByActive, sortQuestionByUnanswered } from '../helper';


function QuestionsDisplayHeader(props) {

    const [_questionDisplayLength, setQuestionDisplayLength] = useState(props.displayQuestions.length);

    useEffect(() => {
        setQuestionDisplayLength(() => props.displayQuestions.length);
    }, [props.displayQuestions]);

    /**
     * describe the behavior of the newest button
     */
    function newestButton() {
        props.setQuestionsHeaderDisplay(() => 0);
        let questionSelected = sortQuestionByLatest(props.questions);
        props.setDisplayQuestions(() => questionSelected);
    }

    /**
     * describe the behavior of the active button
     */
    function activeButton() {
        props.setQuestionsHeaderDisplay(() => 0);
        let questionSelected = sortQuestionByActive(props.questions, props.answers);
        props.setDisplayQuestions(() => questionSelected);
    }

    /**
     * describe the behavior of the unanswered button
     */
    function unansweredButton() {
        props.setQuestionsHeaderDisplay(() => 0);
        let questionSelected = sortQuestionByUnanswered(props.questions);
        props.setDisplayQuestions(() => questionSelected);
    }

    useEffect(() => {
        const { searchTerm, questions, tags, searchFocus, setDisplayQuestions } = props;
        if (!searchFocus) {
            return;
        }
        if (searchTerm === '') {
            props.setSearchResult(() => true);
            newestButton();
            return;
        }
        props.setQuestionsHeaderDisplay(() => 1);
        let questionsSelected = [];
        if (/\[.*\]/.test(searchTerm) && searchTerm.split(' ').length > 1) {
            let allKeyWords = searchTerm.split(' ');
            let allTags = '';
            for (let i = 0; i < allKeyWords.length; i++) {
                if (/\[.*\]/.test(allKeyWords[i])) {
                    allTags += allKeyWords[i];
                    allKeyWords.splice(i, 1);
                    i--;
                }
            }
            let questionByTags = searchByTags(allTags, questions, tags);
            let questionByKeywords = searchByKeywords(allKeyWords.join(' '), questions, tags);
            questionsSelected = questionByTags.concat(questionByKeywords);
            questionsSelected = questionsSelected.filter((question, index) => {
                return index === questionsSelected.findIndex(q => question.qid === q.qid);
            });
        }
        else if (/\[.*\]/.test(props.searchTerm)) {
            questionsSelected = searchByTags(props.searchTerm, questions, tags);
        } else {
            questionsSelected = searchByKeywords(props.searchTerm, questions);
        }
        questionsSelected = sortQuestionByLatest(questionsSelected);
        if (questionsSelected.length === 0) {
            props.setSearchResult(() => false);
            setDisplayQuestions(() => []);
            return;
        }
        props.setSearchResult(() => true);
        setDisplayQuestions(() => questionsSelected);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.searchTerm]);


    function questionsHeaderDispay(option) {
        switch (option) {
            case 1:
                return "Search Result";
            case 2:
                return "Tag's Questions";
            default:
                return "All Questions";
        }
    }

    function askQuestionClick() {
        console.log("button clicked");
        props.setPageToDisplay("newQuestions");
    }

    return (
        <div className="main-header">
            <div className="main-body-header">
                <h1 id="all-questions-header">{questionsHeaderDispay(props.questionsHeaderDisplay)}</h1>
                <button className="ask-question-button" type="button" onClick={askQuestionClick}>Ask Question</button>
            </div>

            <div id="main-body-header-2" className="main-body-header">
                <h2><span id="question-counter">{_questionDisplayLength}</span> Questions</h2>

                <div id="sorting-button-group-container">
                    <button onClick={newestButton} className="sorting-button-group">Newest</button>
                    <button onClick={activeButton} className="sorting-button-group">Active</button>
                    <button onClick={unansweredButton} className="sorting-button-group">Unanswered</button>
                </div>
            </div>
        </div>
    );
}

/**
* return all the questions that has the include at least one of the tag within the input.
* @param {String} input 
* @returns 
*    an array of questions that has at least one of the tag within the input.
*/
function searchByTags(input, questions, tags) {
    questions = [...questions];
    tags = [...tags];
    if (input === '' || input === null || input === undefined || input.length === 0) {
        return [];
    }
    let allKeyTags = input.split(']');
    allKeyTags = allKeyTags.map(function (item) {
        return item.substring(1);
    });
    allKeyTags.pop();

    const allTagsName = tags.map(tag => tag.name);
    allKeyTags = allKeyTags.filter(tag => allTagsName.indexOf(tag) !== -1);
    if (allKeyTags.length === 0) {
        return [];
    }

    const questionsDetected = questions.filter(
        question => allKeyTags.some(
            tag => question.tagIds.some(
                tagId =>
                    (tags.filter(tag2 => tag2.name === tag) === -1 ? 'DNE' : tags.filter(tag2 => tag2.name === tag)[0].tid) === tagId
            )
        )
    );
    return questionsDetected;
}

/**
 * return all the questions that has the include at least one of the keyword within the input.
 * @param {String} input 
 * @returns 
 *    an array of questions that has at least one of the keyword within the input.
 */
function searchByKeywords(input, questions) {
    questions = [...questions];
    if (input === '' || input === null || input === undefined || input.length === 0) {
        return [];
    }
    const allKeyWords = input.split(' ');
    for (let i = 0; i < allKeyWords.length; i++) {
        if (allKeyWords[i] === "") {
            allKeyWords.splice(i, 1);
            i--;
        }
    }
    const questionsDetected = questions.filter(
        question => allKeyWords.some(
            keyword => (question.title + " " + question.text).toLowerCase().indexOf(keyword) !== -1
        )
    );
    return questionsDetected;
}

export default QuestionsDisplayHeader;
import '../stylesheets/App.css';
import '../stylesheets/QuestionsDisplayHeader.css';

import { useCallback, useEffect, useState } from 'react';
import { sortQuestionByLatest, sortQuestionByActive, sortQuestionByUnanswered } from '../helper';


function QuestionsDisplayHeader(props) {

    const [_questionDisplayLength, setQuestionDisplayLength] = useState(props.displayQuestions.length);
    const { searchTerm, questions, tags, searchFocus, setDisplayQuestions, setSearchResult, setQuestionsHeaderDisplay } = props;

    useEffect(() => {
        setQuestionDisplayLength(() => props.displayQuestions.length);
    }, [props.displayQuestions]);

    /**
     * describe the behavior of the newest button
     */
    const newestButton = useCallback(() => {
        setQuestionsHeaderDisplay(() => 0);
        let questionSelected = sortQuestionByLatest(questions);
        setDisplayQuestions(() => questionSelected);
    }, [questions, setDisplayQuestions, setQuestionsHeaderDisplay]);

    /**
     * describe the behavior of the active button
     */
    function activeButton() {
        props.setQuestionsHeaderDisplay(() => 0);
        let questionSelected = sortQuestionByActive(props.questions);
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
        if (!searchFocus) {
            return;
        }
        if (searchTerm === '') {
            setSearchResult(() => true);
            newestButton();
            return;
        }
        setQuestionsHeaderDisplay(() => 1);
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
        else if (/\[.*\]/.test(searchTerm)) {
            questionsSelected = searchByTags(searchTerm, questions, tags);
        } else {
            questionsSelected = searchByKeywords(searchTerm, questions);
        }
        questionsSelected = sortQuestionByLatest(questionsSelected);
        if (questionsSelected.length === 0) {
            setSearchResult(() => false);
            setDisplayQuestions(() => []);
            return;
        }
        setSearchResult(() => true);
        setDisplayQuestions(() => questionsSelected);
    }, [newestButton, questions, searchFocus, searchTerm, setDisplayQuestions, setQuestionsHeaderDisplay, setSearchResult, tags]);


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
            tag => question.tags.some(tag2 => {
                return tag2.name === tag;
            })
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
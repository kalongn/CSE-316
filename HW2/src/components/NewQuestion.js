import '../stylesheets/App.css';
import '../stylesheets/NewQuestion.css';

import { sortQuestionByLatest } from '../helper';

function NewQuestion(props) {

    function resetErrorMessages() {
        const errorElements = document.querySelectorAll('.new-questions-page-error-message');
        errorElements.forEach((errorElement) => {
            errorElement.textContent = '';
        });
    }

    /**
     * Display an error message for the specified element
     * @param {string} elementId 
     * @param {string} message 
     */
    function displayErrorMessage(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.innerHTML = message;
    }


    /**
     * Checks if user input is valid once post question button is clicked. If valid calls addQuestionToModel otherwise
     * displays relevant error messages
     */
    function postQuestion() {
        // Retrieve user inputs
        let titleInput = document.getElementById('new-question-title').value.trim();
        let detailsInput = document.getElementById('new-question-details').value.trim();
        let tagsInput = document.getElementById('new-question-tags').value.trim();
        let usernameInput = document.getElementById('new-question-username').value.trim();

        // Reset error messages
        resetErrorMessages();

        // Validation flags
        let isValid = true;

        // Validate title
        if (titleInput.length === 0 || titleInput.length > 100) {
            displayErrorMessage('new-question-title-error-msg', 'Error: Title must be 1-100 characters');
            isValid = false;
        }

        // Validate details
        if (detailsInput.length === 0) {
            displayErrorMessage('new-question-details-error-msg', 'Error: Details cannot be empty');
            isValid = false;
        }

        let tagArray = tagsInput.split(/\s+/); // Split by whitespace
        tagArray = tagArray.map((tag) => tag.toLowerCase());

        // Validate tags
        if (tagsInput.length !== 0) {
            if (tagArray.length > 5) {
                displayErrorMessage('new-question-tags-error-msg', 'Error: Maximum of 5 tags allowed');
                isValid = false;
            }
            for (const tag of tagArray) {
                if (tag.length > 10) {
                    displayErrorMessage('new-question-tags-error-msg', 'Error: Tag length should not exceed 10 characters');
                    isValid = false;
                    break; // Stop checking tags on first error
                }
            }
        } else {
            displayErrorMessage('new-question-tags-error-msg', 'Error: Tags are required and cannot be empty');
            isValid = false;
        }

        // Validate username
        if (usernameInput.length === 0) {
            displayErrorMessage('new-question-username-error-msg', 'Error: Username cannot be empty');
            isValid = false;
        }

        // Validate text links
        const regex = /\[([^\]]+)\]\(([^\s)]*)\)/g;
        const allResults = [...detailsInput.matchAll(regex)];
        if (allResults.length !== 0) {
            for (const result of allResults) {
                if (result[2] === "") {
                    isValid = false;
                    displayErrorMessage('new-question-details-error-msg', 'Error: link cannot be empty');
                    break;
                }
                if (result[2].indexOf("http://") !== 0 && result[2].indexOf("https://") !== 0) {
                    isValid = false;
                    displayErrorMessage('new-question-details-error-msg', 'Error: link must start with http:// or https://');
                    break;
                }
            }
        }


        // If all inputs are valid, you can proceed to post the question
        if (isValid) {

            /* 
            let questionUpdated = [...props.questions]
            questionUpdated.add(<Object of the new Questions>);
            // do the same thing for answers and tags
            props.setQuestion(() => questionUpdated);
            */

            let questionUpdated = [...props.questions];
            let tagsUpdated = [...props.tags];

            const newQid = "q" + (questionUpdated.length + 1);
            const newTagIds = [];

            for (const newTag of tagArray) {
                let isPresent = false;
                for (const existingTag of tagsUpdated) {
                    if (newTag === existingTag.name) {
                        newTagIds.push(existingTag.tid);
                        isPresent = true;
                    }
                }

                if (!isPresent) {
                    const tagNum = `t${tagsUpdated + 1}`;
                    let tempObj = {
                        tid: tagNum,
                        name: newTag,
                    };
                    tagsUpdated.push(tempObj);
                    newTagIds.push(tagNum);
                }
            }
            questionUpdated.push({
                qid: newQid,
                title: titleInput,
                text: detailsInput,
                tagIds: newTagIds,
                askedBy: usernameInput,
                askDate: new Date(),
                ansIds: [],
                views: 0,
            });


            props.setQuestions(() => questionUpdated);
            props.setTags(() => tagsUpdated);
            props.setDisplayQuestions(() => sortQuestionByLatest(questionUpdated));

            titleInput = '';
            detailsInput = '';
            tagsInput = '';
            usernameInput = '';

            props.setPageToDisplay(() => 'questions');
        }
    }

    return (
        <div id="new-questions-page-wrapper" className="new-questions-page-wrapper">
            <div className="new-questions-page-titles">
                Question Title<span className="new-questions-page-important">*</span>
            </div>
            <div className="new-questions-page-subtitles">
                Limit title to 100 characters or less
            </div>
            <div>
                <input id="new-question-title" className="new-questions-page-textboxes" type="text" maxLength="100">
                </input>
            </div>
            <div id="new-question-title-error-msg" className="new-questions-page-error-message">
            </div>


            <div className="new-questions-page-titles">
                Question Text<span className="new-questions-page-important">*</span>
            </div>
            <div className="new-questions-page-subtitles">
                Add details
            </div>
            <div>
                <textarea id="new-question-details" className="new-questions-page-textboxes" rows="6"></textarea>
            </div>
            <div id="new-question-details-error-msg" className="new-questions-page-error-message">
            </div>


            <div className="new-questions-page-titles">
                Tags<span className="new-questions-page-important">*</span>
            </div>
            <div className="new-questions-page-subtitles">
                Add keywords separated by whitespace
            </div>
            <div>
                <input id="new-question-tags" className="new-questions-page-textboxes" type="text" maxLength="54"></input>
            </div>
            <div id="new-question-tags-error-msg" className="new-questions-page-error-message">
            </div>


            <div className="new-questions-page-titles">
                Username<span className="new-questions-page-important">*</span>
            </div>
            <div>
                <input id="new-question-username" className="new-questions-page-textboxes" type="text" maxLength="100"></input>
            </div>
            <div id="new-question-username-error-msg" className="new-questions-page-error-message">

            </div>


            <div className="new-questions-page-footer">
                <div id="post-button-wrapper">
                    <button id="post-question-button" className="post-question-button" type="button" onClick={postQuestion}>Post Question</button>
                </div>
                <div id="new-questions-page-bottom-text">
                    <span className="new-questions-page-important">* indicates mandatory fields</span>
                </div>
            </div>

        </div>
    );
}

export default NewQuestion;
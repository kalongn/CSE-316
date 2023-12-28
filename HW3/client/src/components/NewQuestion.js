import '../stylesheets/App.css';
import '../stylesheets/NewQuestion.css';

import { sortQuestionByLatest } from '../helper';

import Axios from 'axios';
const expressServer = "http://localhost:8000"

function NewQuestion(props) {

    const { setTags, setDisplayQuestions, setQuestions } = props;

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
    async function postQuestion() {
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
            let tagsUpdated = [...props.tags];
            const newTagIds = [];
            const tagsNeedCreate = [];

            for (const newTag of tagArray) {
                let isPresent = false;

                for (const existingTag of tagsUpdated) {
                    if (newTag === existingTag.name) {
                        newTagIds.push(existingTag._id);
                        isPresent = true;
                        break;
                    }
                }

                if (!isPresent) {
                    tagsNeedCreate.push(newTag);
                }
            }

            try {
                // Create promises for tag creation
                const tagsPromises = tagsNeedCreate.map(newTag => {
                    return Axios.post(`${expressServer}/TagCreate/${newTag}`);
                });

                // Wait for all tag creation promises to resolve
                await Promise.all(tagsPromises);

                // Fetch updated tags
                const updatedTagsResponse = await Axios.get(`${expressServer}/Tags`);
                const updatedTags = updatedTagsResponse.data;
                setTags(updatedTags);

                // Map new tag names to their corresponding IDs
                tagsNeedCreate.forEach(tag => {
                    newTagIds.push(updatedTags.find(tagObj => tagObj.name === tag)._id);
                });

                // Create a new question with the obtained tag IDs
                await Axios.post(`${expressServer}/QuestionCreate/${titleInput}/${detailsInput}/${newTagIds}/${usernameInput}`);

                // Fetch and update questions
                const updatedQuestionsResponse = await Axios.get(`${expressServer}/Questions`);
                const updatedQuestions = updatedQuestionsResponse.data;
                setQuestions(updatedQuestions);
                setDisplayQuestions(sortQuestionByLatest(updatedQuestions));
                titleInput = '';
                detailsInput = '';
                tagsInput = '';
                usernameInput = '';
                props.setPageToDisplay(() => 'questions');
            } catch (error) {
                console.error("Error:", error);
            }
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
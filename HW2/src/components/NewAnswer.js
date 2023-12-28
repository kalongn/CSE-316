import "../stylesheets/App.css";
import "../stylesheets/NewAnswer.css";

function NewAnswer(props) {
    function resetErrorMessages() {
        const errorElements = document.querySelectorAll('.new-answer-page-error-message');
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

    function postAnswer() {
        
        // Retrieve user inputs
        let answerUsername = document.getElementById('new-answer-username').value.trim();
        let answerDetails = document.getElementById('new-answer-details').value.trim();
      
        // Reset error messages
        resetErrorMessages();
      
        // Validation flags
        let isValid = true;
      
        // Validate username
        if (answerUsername.length === 0) {
          displayErrorMessage('new-answer-username-error-msg', 'Error: Username cannot be empty');
          isValid = false;
        }
      
        // Validate details
        if (answerDetails.length === 0) {
          displayErrorMessage('new-answer-details-error-msg', 'Error: Details cannot be empty');
          isValid = false;
        }

        const regex = /\[([^\]]+)\]\(([^\s)]*)\)/g;
        const allResults = [...answerDetails.matchAll(regex)];
        if (allResults.length !== 0) {
            for (const result of allResults) {
                if (result[2] === "") {
                    isValid = false;
                    displayErrorMessage('new-answer-details-error-msg', 'Error: link cannot be empty');
                    break;
                }
                if (result[2].indexOf("http://") !== 0 && result[2].indexOf("https://") !== 0) {
                    isValid = false;
                    displayErrorMessage('new-answer-details-error-msg', 'Error: link must start with http:// or https://');
                    break;
                }
            }
        }
      
        // If all inputs are valid, you can proceed to post the question
        if (isValid) {

            let answerUpdated = [...props.answers];
            let questionUpdated = [...props.questions];

            const newAid = "a" + (answerUpdated.length + 1);
            const newAnswer = {
                aid: newAid,
                text: answerDetails,
                ansBy: answerUsername,
                ansDate: new Date(),
            };

            answerUpdated.push(newAnswer);

            // Add the new answer to the answers array
            props.setAnswers(() => answerUpdated);
            
            let currentQuestion = props.questions.filter(question => question.qid === props.questionAnswerId)[0];

            for (const question of questionUpdated) {
                if (question.qid === currentQuestion.qid) {
                    question.ansIds.push(newAid);
                    break;
                }
            }

            // Update the ansIds array of the corresponding question
            props.setQuestions(() => questionUpdated);
            
            answerUsername = '';
            answerDetails = '';

            props.setPageToDisplay(() => 'answer');
        }
      }

    return (
        <div className="new-answer-page-wrapper">
            <div className="new-answer-page-titles">
                Username<span className="new-answer-page-important">*</span>
            </div>
            <div>
                <input id="new-answer-username" className="new-answer-page-textboxes" type="text" maxLength="100" />
            </div>
            <div id="new-answer-username-error-msg" className="new-answer-page-error-message">
            </div>


            <div className="new-answer-page-titles">
                Answer Text<span className="new-answer-page-important">*</span>
            </div>
            <div>
                <textarea id="new-answer-details" className="new-answer-page-textboxes" rows="9"></textarea>
            </div>
            <div id="new-answer-details-error-msg" className="new-answer-page-error-message"></div>


            <div className="new-answer-page-footer">
                <div>
                    <button id="post-answer-button" className="post-answer-button" type="button" onClick={postAnswer}>Post Answer</button>
                </div>
                <div className="new-answer-page-bottom-text">
                    <span className="new-answer-page-important">* indicates mandatory fields</span>
                </div>
            </div>
        </div>
    );
}

export default NewAnswer;
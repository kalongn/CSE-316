/* eslint-disable no-unused-vars */
/**
 * Generate the time passed given a Date input.
 * @param {Date} questionPostDate 
 *    the date input
 * @returns 
 *    a string representing how long it has elasped.
 */
export function timeElapsedDisplay(questionPostDate) {
    const Months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    questionPostDate = new Date(questionPostDate);

    const timeDifference = currentDate - questionPostDate;
    const secondPassed = Math.floor(timeDifference / 1000);
    const minutePassed = Math.floor(timeDifference / (1000 * 60));
    const hourPassed = Math.floor(timeDifference / (1000 * 60 * 60));
    const yearPassed = Math.floor(timeDifference / (365 * 24 * 60 * 60 * 1000));

    if (yearPassed > 0) {
        return `${Months[questionPostDate.getMonth()]}, ${String(questionPostDate.getDate()).padStart(2, '0')} ${questionPostDate.getFullYear()} at ${String(questionPostDate.getHours()).padStart(2, '0')}:${String(questionPostDate.getMinutes()).padStart(2, '0')}`;
    }

    if (hourPassed >= 24) {
        return `${Months[questionPostDate.getMonth()]}, ${String(questionPostDate.getDate()).padStart(2, '0')} at ${String(questionPostDate.getHours()).padStart(2, '0')}:${String(questionPostDate.getMinutes()).padStart(2, '0')}`;
    }

    if (minutePassed >= 60) {
        return `${hourPassed} hours ago`
    }

    if (secondPassed >= 60) {
        return `${minutePassed} minutes ago`
    }

    return `${secondPassed} seconds ago`

}

/**
 * Sort the list of questions base on the most recently asked.
 */
export function sortQuestionByLatest(questions) {
    questions = [...questions];
    questions.sort((a, b) => new Date(b.asked_date_time) - new Date(a.asked_date_time));
    return questions;
}


/**
 * all questions in the model sorted by answer activity.
 */
export function sortQuestionByActive(questions) {
    questions = [...questions];
    const questionsWithNoAnswer = questions.filter(question => question.answers.length === 0);
    const questionsWithAnswer = questions.filter(question => question.answers.length > 0);
    questionsWithAnswer.sort((a, b) => {
        return new Date(b.answers[b.answers.length - 1].ans_date_time) - new Date(a.answers[a.answers.length - 1].ans_date_time);
    });
    sortQuestionByLatest(questionsWithNoAnswer);
    questions = [...questionsWithAnswer, ...questionsWithNoAnswer];
    return questions;
}

/**
 * filter out question that has an answer and keep all the questions that does not have answer
 */
export function sortQuestionByUnanswered(questions) {
    questions = [...questions];
    return sortQuestionByLatest(questions.filter(question => question.answers.length === 0));
}

/**
 * Takes in the description, and return all the linkedList and url of object into to it.
 * @param {String} description 
 * @returns 
 *      an array of objects with the linkText and url.
 */
export function detectHyperLinks(description) {
    const regex = /\[([^\]]+)\]\( *(https?:\/\/[^\s)]*) *\)/g;
    const allResults = [...description.matchAll(regex)];

    const validHyperlinks = allResults.map(result => {
        const linkText = result[1];
        const url = result[2];
        return { linkText, url };
    })
    return validHyperlinks;
};

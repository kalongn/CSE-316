const Questions = require("../models/questions");
const Answers = require("../models/answers");
const Tags = require("../models/tags");

exports.displayQuestions = async (res) => {
    const questions = await Questions.find({})
        .populate('tags')
        .populate('answers');
    res.json(questions);
};
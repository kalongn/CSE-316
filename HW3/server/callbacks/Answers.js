const Answers = require("../models/answers");

exports.displayAnswers = async (res) => {
    const answers = await Answers.find({})
    res.json(answers);
};
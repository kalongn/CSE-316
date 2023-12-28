const Answers = require('../models/answers');

exports.createAnswer = (req, res) => {
    const { text, ans_by } = req.params;
    Answers.create({ text: text, ans_by: ans_by, ans_date_time: new Date() }).then(answer => {
        const ansId = answer._id;
        res.json({ message: "Answer created successfully", ansId });
    }).catch(err => {
        res.status(400).json({ message: err.message });
    });
}
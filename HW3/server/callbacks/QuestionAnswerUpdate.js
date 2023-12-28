const Answers = require('../models/answers');
const Questions = require('../models/questions');

exports.updateAnswer = (req, res) => {
    const { qid, aid } = req.params;
    Questions.findByIdAndUpdate(qid, { $push: { answers: aid } }, { new: true }).then(() => {
        res.status(200).json({
            message: "Question's Answer updated successfully"
        });
    }).catch(err => {
        res.status(500).json({
            message: "Error updating Question's Answer",
            error: err
        });
    });
}


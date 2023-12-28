const Questions = require("../models/questions");

exports.createQuestion = (req, res) => {
    const { title, text, tagIds, askedBy } = req.params;
    const tagArray = tagIds.split(",");
    Questions.create({ title: title, text: text, tags: tagArray, asked_by: askedBy, asked_date_time: new Date() }).then(() => {
        res.json({ message: "Questions created successfully" });
    }).catch(err => {
        res.status(400).json({ message: err.message });
    });
}
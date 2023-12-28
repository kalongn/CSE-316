const Tags = require("../models/tags");

exports.createTag = (req, res) => {
    const { name } = req.params;
    Tags.create({ name }).then(() => {
        res.json({ message: "Tag created successfully" });
    }).catch(err => {
        res.status(400).json({ message: err.message });
    });
}
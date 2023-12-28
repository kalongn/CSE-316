const Tags = require("../models/tags");

exports.displayTags = async (res) => {
    const tags = await Tags.find({})
    res.json(tags);
};
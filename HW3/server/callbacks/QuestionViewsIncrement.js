const Questions = require("../models/questions");

exports.incrementViews = (req, res) => {
    const { id } = req.params;
    Questions.findByIdAndUpdate(id, { $inc: { views: 1 } }).then(() => {
        res.status(200).json({
            message: "Views updated successfully"
        });
    }).catch(err => {
        res.status(500).json({
            message: "Error updating views",
            error: err
        });
    });
};
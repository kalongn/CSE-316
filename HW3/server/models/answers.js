// Answer Document Schema
const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let AnswerSchema = new Schema(
    {
        text: { type: String, required: true },
        ans_by: { type: String, required: true },
        ans_date_time: { type: Date, default: new Date() },
    },
    {
        toJSON: { virtuals: true },
    }
);

AnswerSchema.virtual('url').get(function () {
    return `posts/answer/${this._id}`;
});

module.exports = mongoose.model('Answer', AnswerSchema);

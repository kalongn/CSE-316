// Question Document Schema
const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let QuestionSchema = new Schema(
    {
        title: { type: String, required: true, maxLength: 100 },
        text: { type: String, required: true },
        summary: { type: String, required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', required: true }],
        asked_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        answers: [{ type: Schema.Types.ObjectId, ref: 'Answer', default: [] }],
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
        vote: { type: Number, default: 0 },
        asked_date_time: { type: Date, default: new Date() },
        views: { type: Number, default: 0 },
    },
    {
        toJSON: { virtuals: true },
    }
);

QuestionSchema.virtual('url').get(function () {
    return `posts/question/${this._id}`;
});

module.exports = mongoose.model('Question', QuestionSchema);
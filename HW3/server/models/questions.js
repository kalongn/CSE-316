// Question Document Schema
const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let QuestionSchema = new Schema(
    {
        title: { type: String, required: true, maxLength: 100 },
        text: { type: String, required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', required: true }],
        answers: [{ type: Schema.Types.ObjectId, ref: 'Answer', default: [] }],
        asked_by: { type: String, default: "Anonymous" },
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
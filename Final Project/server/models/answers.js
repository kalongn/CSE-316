// Answer Document Schema
const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let AnswerSchema = new Schema(
    {
        text: { type: String, required: true },
        ans_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
        vote: { type: Number, default: 0 },
        ans_date_time: { type: Date, default: new Date() }
    },
    {
        toJSON: { virtuals: true },
    }
);

AnswerSchema.virtual('url').get(function () {
    return `posts/answer/${this._id}`;
});

module.exports = mongoose.model('Answer', AnswerSchema);

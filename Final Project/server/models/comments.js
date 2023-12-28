// Comment Document Schema
const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let CommentSchema = new Schema(
    {
        text: { type: String, required: true },
        com_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        vote: { type: Number, default: 0 },
        com_date_time: { type: Date, default: new Date() }
    },
    {
        toJSON: { virtuals: true },
    }
);

CommentSchema.virtual('url').get(function () {
    return `posts/comment/${this._id}`;
});

module.exports = mongoose.model('Comment', CommentSchema);

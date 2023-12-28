// Tag Document Schema
const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let TagSchema = new Schema(
    {
        name: { type: String, required: true },
    },
    {
        toJSON: { virtuals: true },
    }
);

TagSchema.virtual('url').get(function () {
    return `posts/tag/${this._id}`;
});

module.exports = mongoose.model('Tag', TagSchema);
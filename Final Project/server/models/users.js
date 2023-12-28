// User Document Schema
const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let userSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true },
        hashed_password: { type: String, required: true },
        permission: { type: String, enum: ['ADMIN', 'USER', 'GUEST'], default: 'GUEST' },
        member_since: { type: Date, default: new Date() },
        reputation: { type: Number, default: 0 }
    },
    {
        toJSON: { virtuals: true },
    }
);

userSchema.virtual('url').get(function () {
    return `posts/user/${this._id}`;
});

module.exports = mongoose.model('User', userSchema);
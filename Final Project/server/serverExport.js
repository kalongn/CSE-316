const User = require('./models/users');
const Answer = require('./models/answers');
const Question = require('./models/questions');
const Comment = require('./models/comments');
const Tag = require('./models/tags');
const mongoose = require('mongoose');

function userCreate(username, email, hashed_password, permission = 'GUEST', reputation = 0, member_since = new Date()) {
    userDetail = {
        username: username,
        email: email,
        hashed_password: hashed_password,
        permission: permission,
        reputation: reputation,
        member_since: member_since
    }
    let user = new User(userDetail);
    return user.save();
}

function tagCreate(tagName, userList) {
    tagDetail = {
        name: tagName,
        used_by: userList
    }
    let tag = new Tag(tagDetail);
    return tag.save();
}

function commentCreate(text, user, com_date_time = new Date()) {
    commentDetail = {
        text: text,
        com_by: user,
        com_date_time: com_date_time
    }
    let comment = new Comment(commentDetail);
    return comment.save();
}

function answerCreate(text, user, comments = [], ans_date_time = new Date()) {
    answerDetail = {
        text: text,
        ans_by: user,
        comments: comments,
        ans_date_time: ans_date_time
    }
    let answer = new Answer(answerDetail);
    return answer.save();
}

function questionCreate(title, text, summary, tagsList, user, answersList = [], views = 0, asked_date_time = new Date()) {
    questionDetail = {
        title: title,
        text: text,
        summary: summary,
        tags: tagsList,
        asked_by: user,
        answers: answersList,
        views: views,
        asked_date_time: asked_date_time,
    }
    let question = new Question(questionDetail);
    return question.save();
}

function getAllQuestions() {
    return Question.find()
        .populate('comments')
        .populate('tags')
        .populate('asked_by')
        .populate('answers')
        ;
}

function getAllTags() {
    return Tag.find()
        .populate('used_by');
}

function fineUserByEmail(email) {
    return User.findOne({ email: email });
}

function findTags(tags) {
    return Tag.find({ name: { $in: tags } });
}

async function updateTags(tags) {
    const tagsIDarray = tags.map(tag => tag._id);
    const tagsUsedBy = tags.map(tag => tag.used_by)
    for (let i = 0; i < tags.length; i++) {
        await Tag.findByIdAndUpdate(tagsIDarray[i], { used_by: tagsUsedBy[i] });
    }
    return;
}

function findQuestionByID(id) {
    return Question.findById(id);
}

function updateQuestionViews(id) {
    return Question.findByIdAndUpdate(id, { $inc: { views: 1 } }).populate('comments')
        .populate('tags')
        .populate('asked_by')
        .populate('answers');
}

async function incrementQuestionVoteAndUserReputation(qid, uid) {
    await User.findByIdAndUpdate(uid, { $inc: { reputation: 5 } });
    return Question.findByIdAndUpdate(qid, { $inc: { vote: 1 } }).populate('comments')
        .populate('tags')
        .populate('asked_by')
        .populate('answers');
}

async function incrementAnswerVoteAndUserReputation(aid, uid) {
    await User.findByIdAndUpdate(uid, { $inc: { reputation: 5 } });
    return Answer.findByIdAndUpdate(aid, { $inc: { vote: 1 } }).populate('comments')
        .populate('ans_by');
}

async function undoIncrementQuestionVoteAndUserReputation(qid, uid) {
    await User.findByIdAndUpdate(uid, { $inc: { reputation: -5 } });
    return Question.findByIdAndUpdate(qid, { $inc: { vote: -1 } }).populate('comments')
        .populate('tags')
        .populate('asked_by')
        .populate('answers');
}

async function decrementQuestionVoteAndUserReputation(qid, uid) {
    await User.findByIdAndUpdate(uid, { $inc: { reputation: -10 } });
    return Question.findByIdAndUpdate(qid, { $inc: { vote: -1 } }).populate('comments')
        .populate('tags')
        .populate('asked_by')
        .populate('answers');
}

async function decrementAnswerVoteAndUserReputation(aid, uid) {
    await User.findByIdAndUpdate(qid, { $inc: { reputation: -10 } });
    return Answer.findByIdAndUpdate(aid, { $inc: { vote: -1 } }).populate('comments')
        .populate('ans_by');
}

async function undoDecrementQuestionVoteAndUserReputation(qid, uid) {
    await User.findByIdAndUpdate(uid, { $inc: { reputation: 5 } });
    return Question.findByIdAndUpdate(qid, { $inc: { vote: 1 } }).populate('comments')
        .populate('tags')
        .populate('asked_by')
        .populate('answers');
}

function findAnswerByIDs(ids) {
    return Answer.find({ _id: { $in: ids } }).populate('ans_by').populate('comments');
}

function findCommentsByIDs(ids) {
    return Comment.find({ _id: { $in: ids } }).populate('com_by');
}

async function updateCommentVote(cid) {
    return Comment.findByIdAndUpdate(cid, { $inc: { vote: 1 } }).populate('com_by');
}

function updateQuestionComments(qid, comment) {
    return Question.findByIdAndUpdate(qid, { $push: { comments: comment } }).populate('comments')
        .populate('tags')
        .populate('asked_by')
        .populate('answers');
}

function updateAnswerComments(aid, comment) {
    return Answer.findByIdAndUpdate(aid, { $push: { comments: comment } }).populate('comments')
        .populate('ans_by');
}

function updateQuestionAnswers(qid, answer) {
    return Question.findByIdAndUpdate(qid, { $push: { answers: answer } }).populate('comments')
        .populate('tags')
        .populate('asked_by')
        .populate('answers');
}

function findAllQuestionAskedByUser(uid) {
    return Question.find({ asked_by: uid }).populate('tags');
}

function findAllQuestionAnsweredByUser(uid) {
    return Question.aggregate([
        {
            $lookup: {
                from: 'answers',
                localField: 'answers',
                foreignField: '_id',
                as: 'populatedAnswers'
            }
        },
        {
            $match: {
                'populatedAnswers.ans_by': new mongoose.Types.ObjectId(uid)
            }
        }
    ]);
}

function findAllTagsByUser(uid) {
    return Tag.find({ used_by: { $in: uid } });
}

async function deleteTag(tid) {
    await Question.updateMany({ tags: tid }, { $pull: { tags: tid } });
    const tag = await Tag.findById(tid);
    if (tag.used_by.length === 1) {
        await Tag.findByIdAndDelete(tid);
    } else {
        await Tag.findByIdAndUpdate(tid, { $pull: { used_by: uid } });
    }
    return;
}

async function removeOrDeleteTag(qid, tid, uid) {
    await Question.findByIdAndUpdate(qid, { $pull: { tags: tid } });
    const tag = await Tag.findById(tid);
    if (tag.used_by.length === 1) {
        await Tag.findByIdAndDelete(tid);
    } else {
        await Tag.findByIdAndUpdate(tid, { $pull: { used_by: uid } });
    }
    return;
}

async function updateTag(tid, newTagName) {
    const tagNameExist = await Tag.findOne({ name: newTagName });
    if (tagNameExist !== null) {
        const currentUser = await Tag.findById(tid);
        await Tag.findByIdAndUpdate(tagNameExist._id, { $addToSet: { used_by: { $each: currentUser.used_by } } })
        await Tag.findByIdAndDelete(tid);
        return tagNameExist;
    }
    return Tag.findByIdAndUpdate(tid, { name: newTagName });
}

async function findAnswers(qid, uid) {
    const answers = (await Question.findById(qid)).answers;
    return Answer.find({ ans_by: uid, _id: { $in: answers } })
        .populate('ans_by')
        .populate('comments');
}

async function deleteAnswer(aid) {
    await Question.updateMany({ answers: aid }, { $pull: { answers: aid } });
    const answer = await Answer.findById(aid);
    await Comment.deleteMany({ _id: { $in: answer.comments } });
    await Answer.findByIdAndDelete(aid);
    return;
}

async function deleteQuestion(qid, uid) {
    const QuestionDeleteing = await Question.findById(qid);
    const allAnswer = await Answer.find({ _id: { $in: QuestionDeleteing.answers } });
    for (let answer of allAnswer) {
        await deleteAnswer(answer._id);
    }
    await Comment.deleteMany({ _id: { $in: QuestionDeleteing.comments } });
    for (let tag of QuestionDeleteing.tags) {
        await removeOrDeleteTag(qid, tag._id, uid);
    }
    await Question.findByIdAndDelete(qid);
    return;
}

function updateAnswer(aid, text) {
    return Answer.findByIdAndUpdate(aid, { text: text });
}

function updateQuestion(qid, title, text, summary, newTagsIDs) {
    return Question.findByIdAndUpdate(qid, { title: title, text: text, summary: summary, tags: newTagsIDs });
}

function findAllUsers() {
    return User.find();
}


async function deleteAUser(uid) {
    const allQuestions = await Question.find({ asked_by: uid });
    const allAnswers = await Answer.find({ ans_by: uid });
    const allComments = await Comment.find({ com_by: uid });
    const allTags = await Tag.find({ used_by: uid });
    for (let tag of allTags) {
        if (tag.used_by.length === 1) {
            await Tag.findByIdAndDelete(tag._id);
        } else {
            await Tag.findByIdAndUpdate(tag._id, { $pull: { used_by: uid } });
        }
    }
    for (let comment of allComments) {
        await Comment.findByIdAndDelete(comment._id);
    }
    for (let answer of allAnswers) {
        await Answer.findByIdAndDelete(answer._id);
    }
    for (let question of allQuestions) {
        await Question.findByIdAndDelete(question._id);
    }
    await User.findByIdAndDelete(uid);
    return;
}

function findUserByEmail(email) {
    return User.findOne({ email: email });
};

function findUserByID(uid) {
    return User.findById(uid);
}


module.exports = {
    userCreate, tagCreate, commentCreate, answerCreate, questionCreate, getAllQuestions, getAllTags, fineUserByEmail, findTags, updateTags, findQuestionByID, updateQuestionViews
    , incrementQuestionVoteAndUserReputation, decrementQuestionVoteAndUserReputation, findAnswerByIDs, undoIncrementQuestionVoteAndUserReputation, undoDecrementQuestionVoteAndUserReputation
    , incrementAnswerVoteAndUserReputation, decrementAnswerVoteAndUserReputation, findCommentsByIDs, updateCommentVote, updateQuestionComments, updateAnswerComments, updateQuestionAnswers
    , findAllQuestionAskedByUser, findAllQuestionAnsweredByUser, findAllTagsByUser, deleteTag, updateTag, findAnswers, deleteAnswer, updateAnswer, updateQuestion, removeOrDeleteTag
    , deleteQuestion, findAllUsers, deleteAUser, findUserByEmail, findUserByID
};
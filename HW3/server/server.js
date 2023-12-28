// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

// Need to mongod an instance of mongodb before this as this script only connect and disconnect from it.
// also need to shutdown the instance as well

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

//mongoDB stuff
const mongoDB = "mongodb://127.0.0.1:27017/fake_so";

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});

// Express app stuff
const app = express();
app.use(cors());
const port = 8000;

const Express_Server = app.listen(port, () => {
    console.log(`Express Server is running on https://localhost:${port}`);
});

app.get('/Questions', (req, res) => {
    const Questions = require("./callbacks/Questions");
    Questions.displayQuestions(res);
});

app.get('/Tags', (req, res) => {
    const Tags = require("./callbacks/Tags");
    Tags.displayTags(res);
});

app.get('/Answers', (req, res) => {
    const Answers = require("./callbacks/Answers");
    Answers.displayAnswers(res);
});

app.patch('/QuestionViewsIncrement/:id', (req, res) => {
    const QuestionViewsIncrement = require("./callbacks/QuestionViewsIncrement");
    QuestionViewsIncrement.incrementViews(req, res);
    return;
});

app.post('/TagCreate/:name', (req, res) => {
    const TagCreate = require("./callbacks/TagCreate");
    TagCreate.createTag(req, res);
    return;
});

app.post('/QuestionCreate/:title/:text/:tagIds/:askedBy', (req, res) => {
    const QuestionCreate = require("./callbacks/QuestionCreate");
    QuestionCreate.createQuestion(req, res);
    return;
})

app.post('/AnswerCreate/:text/:ans_by', (req, res) => {
    const AnswerCreate = require("./callbacks/AnswerCreate");
    return AnswerCreate.createAnswer(req, res);
})

app.patch('/QuestionAnswerUpdate/:qid/:aid', (req, res) => {
    const QuestionAnswerUpdate = require("./callbacks/QuestionAnswerUpdate");
    QuestionAnswerUpdate.updateAnswer(req, res);
    return;

})

// SIGINT, aka server terminate ctrl + c thing.
process.on('SIGINT', () => {
    Express_Server.close(() => {
        mongoose.disconnect().then(() => {
            console.log('\nServer closed. Database instance disconnected');
            process.exit(0);
        }).catch((err) => {
            console.log('\nError on disconnecting to MongoDB: ' + err);
            process.exit(1);
        });
    });
});


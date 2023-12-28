// Application server

const cors = require('cors');
const express = require('express');
const session = require("express-session");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { userCreate, tagCreate, commentCreate, answerCreate, questionCreate, getAllQuestions, getAllTags, fineUserByEmail, findTags, updateTags, findQuestionByID, updateQuestionViews
    , incrementQuestionVoteAndUserReputation, decrementQuestionVoteAndUserReputation, findAnswerByIDs, undoIncrementQuestionVoteAndUserReputation, undoDecrementQuestionVoteAndUserReputation
    , incrementAnswerVoteAndUserReputation, decrementAnswerVoteAndUserReputation, findCommentsByIDs, updateCommentVote, updateQuestionComments, updateAnswerComments, updateQuestionAnswers
    , findAllQuestionAskedByUser, findAllQuestionAnsweredByUser, findAllTagsByUser, deleteTag, updateTag, findAnswers, deleteAnswer, updateAnswer, updateQuestion, removeOrDeleteTag
    , deleteQuestion, findAllUsers, deleteAUser, findUserByEmail, findUserByID
} = require('./serverExport');

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
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));
const port = 8000;

const salt = 10;
const secret = "This is supposed to be a super hard to guess string but I am lazy";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    session({
        secret: `${secret}`,
        cookie: {
            httpOnly: true,
            // maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds.
        },
        resave: false,
        saveUninitialized: false
    })
);


const Express_Server = app.listen(port, () => {
    console.log(`Express Server is running on https://localhost:${port}`);
});

const User = require('./models/users');

app.get("/", async (req, res) => {
    let defaultUser = "guest";
    if (req.session.user) {
        res.send(req.session.user);
    } else {
        res.send(defaultUser);
    }
});


app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ errorMessage: "Login/SigninError" });
        }
        const verdict = await bcrypt.compare(password, user.hashed_password);
        if (verdict) {
            req.session.user = user.username.trim();
            req.session.email = user.email.trim();
            return res.status(200).send("Login successful");
        } else {
            return res.status(401).json({ errorMessage: "Login/SigninError" });
        }
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
});

app.post("/signup", async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        if (email.indexOf("@") < 0) {
            return res.status(401).json({ errorMessage: "Login/SigninError" });
        } else if (await User.findOne({ email: email })) {
            return res.status(401).json({ errorMessage: "Login/SigninError" });
        }
        const password = req.body.password;
        if (password.indexOf(username) >= 0 || password.indexOf(0, email.slice(email.indexOf("@"))) >= 0) {
            return res.status(401).json({ errorMessage: "Login/SigninError" });
        }
        const hashedPassword = await bcrypt.hash(password, salt);
        await userCreate(username, email, hashedPassword, 'USER');
        return res.status(200).send("Signup successful");
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
});

app.get("/logout", async (req, res) => {
    try {
        req.session.destroy();
        res.status(200).send("Logout successful");
        return;
    } catch (error) {
        console.error("Error in logout:", error);
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
});

app.get("/questions", async (req, res) => {
    try {
        const allQuestions = await getAllQuestions();
        res.status(200).json(allQuestions);
    } catch (error) {
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
});

app.get("/question", async (req, res) => {
    try {
        const question = await findQuestionByID(req.query.id);
        res.status(200).json(question);
    } catch (error) {
        console.log(error)
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
}
);

app.patch("/question", async (req, res) => {
    try {
        const question = await updateQuestionViews(req.body.id);
        res.status(200).json(question);
    } catch (error) {
        console.log(error)
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
});

// TODO: Need token Verification
app.patch("/question/vote", async (req, res) => {
    try {
        const voteType = req.body.voteType;
        const question = voteType ? await incrementQuestionVoteAndUserReputation(req.body.qid, req.body.uid) : await decrementQuestionVoteAndUserReputation(req.body.qid, req.body.uid);
        res.status(200).json(question);
    } catch (error) {
        console.log(error)
    }
});

// TODO: Need token Verification
app.patch("/question/undoVote", async (req, res) => {
    try {
        const voteType = req.body.voteType;
        const question = voteType ? await undoIncrementQuestionVoteAndUserReputation(req.body.qid, req.body.uid) : await undoDecrementQuestionVoteAndUserReputation(req.body.qid, req.body.uid);
        res.status(200).json(question);
    } catch (error) {
        console.log(error)
    }
});

app.get("/tags", async (req, res) => {
    try {
        const allTags = await getAllTags();
        res.status(200).json(allTags);
    } catch (error) {
        res.status(500).json({ errorMessage: "Internal Server Error" });
    }
});

app.get("/user", async (req, res) => {
    try {
        const email = req.session.email
        let user = await fineUserByEmail(email);
        if (!user) {
            return res.status(401).json({ errorMessage: "User not found" });
        }
        user.hashed_password = undefined;
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error in finding the user:", error);
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
});

app.get("/user/:id", async (req, res) => {
    try {
        const email = req.session.email; 
        const adminUser = await findUserByEmail(email);
        if(adminUser.permission !== 'ADMIN') {
            return res.status(401).json({ errorMessage: "Permission Forbidden" });
        }
        const user = await findUserByID(req.params.id);
        if (!user) {
            return res.status(401).json({ errorMessage: "User not found" });
        }
        user.hashed_password = undefined;
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error in finding the user:", error);
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.get("/newquestionstags", async (req, res) => {
    try {
        const allExistTags = await findTags(req.query.tags);
        const allExistTagsName = allExistTags.map(tag => tag.name);
        const newTags = req.query.tags.filter(tag => !allExistTagsName.includes(tag)) || [];
        return res.status(200).json({ existTags: allExistTags, newTags: newTags });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
});

// TODO: Need token Verification
app.post("/newtags", async (req, res) => {
    try {
        let newTagID = []
        for (const tag of req.body.tags) {
            newTagID.push(await tagCreate(tag, [req.body.user]));
        }
        newTagID = newTagID.map(tag => tag._id);
        return res.status(200).json({ newTagID: newTagID });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
});

// TODO: Need token Verification
app.patch("/tags", async (req, res) => {
    try {
        await updateTags(req.body.tags);
        return res.status(200).send("Update tags successful");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.post("/newquestion", async (req, res) => {
    try {
        await questionCreate(req.body.title, req.body.text, req.body.summary, req.body.tags, req.body.user);
        return res.status(200).send("New question created");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
});

app.get("/answers", async (req, res) => {
    try {
        const answers = await findAnswerByIDs(req.query.ids);
        return res.status(200).json(answers);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.patch("/answer/vote", async (req, res) => {
    try {
        const voteType = req.body.voteType;
        const answer = voteType ? await incrementAnswerVoteAndUserReputation(req.body.aid, req.body.uid) : await decrementAnswerVoteAndUserReputation(req.body.aid, req.body.uid);
        return res.status(200).json(answer);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

app.get("/comments", async (req, res) => {
    try {
        const comments = await findCommentsByIDs(req.query.ids);
        return res.status(200).json(comments);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.patch("/comment/vote", async (req, res) => {
    try {
        const comment = await updateCommentVote(req.body.cid)
        return res.status(200).json(comment);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.post("/newcomments", async (req, res) => {
    try {
        const comment = await commentCreate(req.body.text, req.body.user);
        if (req.body.type === "question") {
            await updateQuestionComments(req.body.id, comment._id);
        } else {
            await updateAnswerComments(req.body.id, comment._id);
        }
        return res.status(200).send("New comment created");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.post("/newanswers", async (req, res) => {
    try {
        const answer = await answerCreate(req.body.text, req.body.user);
        await updateQuestionAnswers(req.body.qid, answer._id);
        return res.status(200).send("New answer created");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.get("/profile/askedquestions", async (req, res) => {
    try {
        const questions = await findAllQuestionAskedByUser(req.query.uid);
        return res.status(200).json(questions);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.get("/profile/tags", async (req, res) => {
    try {
        const tags = await findAllTagsByUser(req.query.uid);
        return res.status(200).json(tags);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.get("/profile/answeredquestions", async (req, res) => {
    try {
        const questions = await findAllQuestionAnsweredByUser(req.query.uid);
        return res.status(200).json(questions);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.delete("/profile/tags/:tid", async (req, res) => {
    try {
        await deleteTag(req.params.tid);
        return res.status(200).send("Delete tags successful");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.patch("/profile/tags/:tid", async (req, res) => {
    try {
        await updateTag(req.params.tid, req.body.newTagName);
        return res.status(200).send("Update tags successful");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.get("/profile/answers", async (req, res) => {
    try {
        const answer = await findAnswers(req.query.qid, req.query.uid);
        return res.status(200).json(answer);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.delete("/profile/answer/:aid", async (req, res) => {
    try {
        await deleteAnswer(req.params.aid);
        return res.status(200).send("Delete answer successful");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.patch("/profile/answer/:aid", async (req, res) => {
    try {
        await updateAnswer(req.params.aid, req.body.text);
        return res.status(200).send("Update Questions successful");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.patch("/profile/question/existTags/:qid/:uid", async (req, res) => {
    try {
        for (const tid of req.body.tags) {
            await removeOrDeleteTag(req.params.qid, tid, req.params.uid);
        }
        return res.status(200).send("Delete removeable tags successful");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.patch("/profile/question/:qid", async (req, res) => {
    try {
        await updateQuestion(req.params.qid, req.body.title, req.body.text, req.body.summary, req.body.tags);
        return res.status(200).send("Update Questions successful");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification
app.delete("/profile/question/:qid/:uid", async (req, res) => {
    try {
        await deleteQuestion(req.params.qid, req.params.uid);
        return res.status(200).send("Delete Questions successful");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification + Check if User Permission is ADMIN
app.get("/profile/users", async (req, res) => {
    try {
        const users = await findAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
})

// TODO: Need token Verification + Check if User Permission is ADMIN
app.delete("/profile/user/:uid", async (req, res) => {
    try {
        // const email = req.session.email
        // let user = await fineUserByEmail(email);
        // if (!user) {
        //     return res.status(401).json({ errorMessage: "User not found" });
        // }
        // if(user.permission !== 'ADMIN') {
        //     return res.status(401).json({ errorMessage: "User not authorized" });
        // }
        await deleteAUser(req.params.uid);
        return res.status(200).send("Delete user successful");
    } catch (error) {
        console.log(error)
        return res.status(500).json({ errorMessage: "Internal Server Error" });
    }
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
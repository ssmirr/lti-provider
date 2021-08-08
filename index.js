const fs = require('fs');

const express = require('express');
const session = require('express-session');
const lti = require("ims-lti");

const app = express();
app.set('view engine', 'ejs');

let ltiSession = {};

app.set('trust proxy'); // trust first proxy
//app.use(session({
//    secret: 'keyboard cat',
//    resave: false,
//    saveUninitialized: true,
//    cookie: { secure: true }
//}));

app.use(session({
        secret: "keyboard cat",
        resave: true,
        rolling: true,
        saveUninitialized: true,
        cookie: {
            sameSite: 'lax'
        }
    }))

app.use(express.urlencoded({
    extended: true
}));

app.post("/assignment", (req, res) => {
    const moodleData = new lti.Provider('top', 'secret');
    moodleData.valid_request(req, (err, isValid) => {
        if (!isValid) {
            res.send("Invalid request: " + err);
            return;
        }

        ltiSession[req.session.id] = moodleData;

        console.log('moodleData.body =>', moodleData.body);

        res.render('assignment', { user: moodleData.body.ext_user_username });
    });

});

app.get('/grade/:grade', (req, res) => {
    let grade = req.params.grade;
    let resp;

    if (grade < 60) {
        resp = `${grade} is too low. How about sixty instead?`;
        grade = 60;
    } else if (grade > 90) {
        resp = `${grade} is too high. How about ninety instead?`;
        grade = 90;
    } else {
        resp = `${grade} sounds reasonable, sure.`;
    }

    console.log('ltiSession[req.session.id] =>', ltiSession[req.session.id], '\n\n');

    // ltiSession[req.session.id].outcome_service.send_replace_result(grade / 100, (err, isValid) => {
    ltiSession[req.session.id].outcome_service.send_replace_result_with_text(grade / 100, "Feedback line 1\n\n\nFeedback line 4", (err, isValid) => {
        if (!isValid)
            resp += `<br/>Update failed ${err}`;

        console.log('grade err => ', err, isValid);

        res.send(resp);
    });
});

// start server on the specified port and binding host
app.listen(4000, '0.0.0.0', function () {
    // print a message when the server starts listening
    console.log("server starting on http://localhost:3000/");
});

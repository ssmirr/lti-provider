const fs = require('fs');

const express = require('express');
const session = require('express-session');
const lti = require("ims-lti");

const app = express();
app.set('view engine', 'ejs');

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

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

        session.moodleData = moodleData;

        console.log('moodleData.body =>', moodleData.body);

        res.render('assignment', { sessionID: session.id, user: moodleData.body.ext_user_username });
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

    console.log('session.moodleData =>', session.moodleData, '\n\n');

    session.moodleData.outcome_service.send_replace_result(grade / 100, (err, isValid) => {
        if (!isValid)
            resp += `<br/>Update failed ${err}`;

        res.send(resp);
    });
});

// start server on the specified port and binding host
app.listen(4000, '0.0.0.0', function () {
    // print a message when the server starts listening
    console.log("server starting on http://localhost:3000/");
});

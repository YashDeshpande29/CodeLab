const express = require("express");
const app = express();
const path = require("path");
const port = 4000;
const bodyP = require("body-parser")

const mongoose = require('mongoose')

// mongoose.connect('mongodb+srv://anirudha22210288:2kJmO4Y1UBBNXApA@code-lab-connect-cluste.hiyclto.mongodb.net/')
// .then(()=>{
//     console.log('mongoDB connected');
// }). catch(()=>{
//     console.log('mongoDB is not connected')
// })
// .catch(()=>{
//     console.log("failed to connect");
// })

const collection = require('./src/user');
const questions = require('./src/questions');
const submission = require('./src/submission');

const compiler = require("compilex");
const options = { stats: true }
compiler.init(options)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/templates'));
app.use(express.static(path.join(__dirname, '/public/css')));
app.use(express.static(path.join(__dirname, '/public/js')));
app.use(express.static(path.join(__dirname, '/public/images')));

app.use(express.static(path.join(__dirname, '/public/codemirror-5.65.16')));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyP.json());

app.get('/', (req, res) => {
    res.send('Welcomme to code lab');
})

app.get('/signin', (req, res) => {
    res.render('signin.ejs');
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

app.post('/signup', async (req, res) => {
    const data = {
        username: req.body.email,
        password: req.body.password,
    }

    let user = await collection.findOne({ username: data.username });
    console.log(user)
    if (user == null) {
        await collection.insertMany([data]);
        console.log("User created successfully");
        // res.redirect('/signin');
        // res.render('error', {err: "User already exists"});
    } else {
        console.log('user already exists');
    }
    res.redirect('/signin');

    // res.render('home' , data);
});


app.post('/signin', async (req, res) => {
    let {username, password} = req.body;
    const check = await collection.findOne({ username: username });
    console.log(`user:${check}`)
    if (check == null) {
        res.render('error', { err: "Signin first" });
    } else {
        console.log(`req.body.password:${req.body.password}`)
        if (check.password === req.body.password) {
            console.log('password matched')
            res.redirect('/' + check.username);
        }
        else {
            console.log('password not matched')
            res.render('error', { err: "Invalid username or password" });
        }
    }


});

app.get('/:username', (req, res) => {
    let { username } = req.params;
    res.render('home', { username });
});

app.get('/:username/:subject', (req, res) => {

    let { username, subject } = req.params;
    res.render('questions', { username, subject });
});

app.get('/:username/:subject/assignments/:id', async (req, res) => {
    // compiler.flush(() => {
    //     console.log("All previous temporary files are flushed !")
    // });

    let username = req.params.username;
    let subject = req.params.subject;
    let id = req.params.id;
    let assignmentDetails = await questions.findOne({ subject: subject, 'question.id': id });
    // console.log(assignmentDetails);
    if (assignmentDetails == null || assignmentDetails.question == null) {
        res.render('error', { err: "Assignment not found" });
    }
    else {
        let data = {
            username: username,
            subject: subject,
            id: id,
            que: assignmentDetails.question.problemStatement,
        }
        // console.log(que);
        res.render('assignments', { data });
    }

});

app.get('/:username/:subject/assignments/:id/view', async (req, res) => {
    let { username, subject, id } = req.params;

    let assignmentList = await submission.findOne({ username, subject });
    if (assignmentList == null) {
        res.render('error', { err: "Assignment submission is not found" });
    } else {
        let assignment = assignmentList.output.find((element) => element.id == id);

        if (assignment == null || assignment.question == null) {
            res.render('error', { err: "Assignment submission is not found" });

        } else {
            let question = assignment.question;
            let code = assignment.code;
            let input = assignment.input;
            let output = assignment.output;

            res.render('submission', { username, subject, id, question, code, output });
        }
    }





});

app.post('/submit', async (req, res) => {
    console.log('submit request ');
    // console.log(req.body);
    let username = req.body.username;
    let subject = req.body.subject;
    let question = req.body.question;
    let id = req.body.id;
    let code = req.body.code;

    let output = req.body.output;

    let currUser = await submission.findOne({ username})
    console.log(`currUser:${currUser}`);
    if(currUser == null){
        await submission.insertMany([{ username: username, subject: subject, output: [{ id, question, code, output }] }])
        .then((data) => {
            console.log('data inserted');
            console.log(data);
        }).catch((err) => {
            console.log(err);
        });
    }else if(currUser.subject == subject){
        // console.log('inside else if')
        let prev = await submission.findOne({ username, subject});
        // console.log(`prev:${prev}`)
        if(prev.output.find((element) => element.id == id) == null){
            await submission.findOneAndUpdate({ username, subject }, { $push: { output: { id, question, code, output } } })
            .then((data) => {
                console.log('data updated');
                console.log(data);
            }).catch((err) => {
                console.log(err);
            });
        }else{
            console.log('inside else else');
            await submission.findOneAndUpdate({ username, subject, 'output.id': id }, { $set: { 'output.$.code': code, 'output.$.output': output } })
            .then((data) => {
                console.log('data updated');
                console.log(data);
            }).catch((err) => {
                console.log(err);
            });
        }
    }else{
        await submission.insertMany([{ username: username, subject: subject, output: [{ id, question, code, output }] }])
        .then((data) => {   
            console.log('data inserted');
            console.log(data);
        }
        ).catch((err) => {
            console.log(err);
        });
    }

   


    res.send('success');    

});

app.post("/compile", function (req, res) {
    let code = req.body.code
    let input = req.body.input
    let lang = req.body.lang
    console.log(req.body.code);
    try {

        if (lang == "C++") {
            if (!input) {
                let envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; // (uses g++ command to compile )
                compiler.compileCPP(envData, code, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
            else {
                let envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; // (uses g++ command to compile )
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
        }
        else if (lang == "Java") {
            if (!input) {
                let envData = { OS: "windows" };
                compiler.compileJava(envData, code, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                })
            }
            else {
                //if windows  
                let envData = { OS: "windows" };
                //else
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                })
            }
        }
        else if (lang == "Python") {
            if (!input) {
                let envData = { OS: "windows" };
                compiler.compilePython(envData, code, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
            else {
                let envData = { OS: "windows" };
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
        }
    }
    catch (e) {
        console.log("error")
    }
})



app.get('*', (req, res) => {
    res.render('error', { err: "404 page not found" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

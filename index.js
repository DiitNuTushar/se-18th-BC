const express = require('express');
const bodyParser = require('body-parser');
// const {login} = require('./modules/auth');
var cors = require('cors')
// app.use(cors())

const app = express();
app.use(bodyParser.json());
app.use(cors())
// /auth/
app.use("/auth", require("./routes/user.route"));
// app.use("/project", require("./routes/project.route"));


app.use((req, res) => {
    res.status(404).json({
        message: "Endpoint Not Found !!!",
    });
});
app.listen('5000', (res) => {
    console.log('application is running on port 5000');
})
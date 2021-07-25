const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || "5000";

app.get('/backstage', (req, res) => {
    res.sendFile(path.join(__dirname, '/backend_cms/build/index.html'))
});

app.get('/backstage/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/backend_cms/build/index.html'))
});

app.use(express.static(path.join(__dirname + "/backend_cms/build")))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/index.html'))
})

app.listen(port);
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || "5000";

/* Frontend:
    frontend route must be place at the first 
*/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/index.html'))
})

/* Backend:
    backend route
*/
app.get('/backstage', (req, res) => {
    res.sendFile(path.join(__dirname, '/backend_cms/build/index.html'))
});

app.get('/backstage/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/backend_cms/build/index.html'))
});

/* Backend:
    backend resources
*/
app.use(express.static(path.join(__dirname + "/backend_cms/build")))

app.listen(port);
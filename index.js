const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || "5000";
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

/* Frontend:
    frontend route must be place at the first 
*/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/index.html"));
});

/* Backend:
    backend route
*/
app.get("/backstage", (req, res) => {
  res.sendFile(path.join(__dirname, "/backend_cms/build/index.html"));
});

app.get("/backstage/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/backend_cms/build/index.html"));
});

/* Service
    api example
*/
app.get("/api", (req, res) => {
  res.status(200).send("api gotcha!!");
});

app.get("/api/img", async (req, res) => {
  res.redirect('http://clecdeMac-mini.local/img/123456')
});

/* Backend:
    backend resources
*/
app.use(express.static(path.join(__dirname + "/backend_cms/build")));

app.listen(port);

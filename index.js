const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || "5000";
const cors = require("cors");
const proxy = require('express-http-proxy');

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

app.use("/backstage-resource", express.static(path.join(__dirname + "/backend_cms/build")));


/* Frontend:
    Site 2 (Cgu therapy system)
*/
app.get("/cgu", (req, res) => {
  res.sendFile(path.join(__dirname, "/cgu-therapy-system/build/index.html"));
});

app.get("/cgu/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/cgu-therapy-system/build/index.html"));
});

app.use("/cgu-resource", express.static(path.join(__dirname + "/cgu-therapy-system/build")));

/* Service
    api example
*/
app.get("/api", (req, res) => {
  res.status(200).send("api gotcha!!");
});

// app.use('/api/img', proxy('http://clecdeMac-mini.local/img/123456',  {
//     filter: function(req, res) {
//        return req.method == 'GET';
//     }
// }));

app.get("/api/img", async (req, res) => {
  res.redirect('http://clecdeMac-mini.local/img/123456')
});

app.listen(port);

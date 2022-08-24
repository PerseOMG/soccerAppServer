const express = require("express");
const baseUrl = "/api/v1";
const app = express();
const teamsRouter = require("./routes/teamsRoutes");
app.use(express.json());

app.use(`${baseUrl}/teams`, teamsRouter);

app.all("*", (req, res, next) => {
    console.log("TO DO: ROUTE");
    next("ERROR");
});

module.exports = app;
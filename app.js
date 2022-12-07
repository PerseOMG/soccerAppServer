const express = require("express");
const baseUrl = "/api/v1";
const cors = require("cors");
const app = express();
const teamsRouter = require("./routes/teamsRoutes");
const userRouter = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());

app.use(`${baseUrl}/teams`, teamsRouter);
app.use(`${baseUrl}/users`, userRouter);

app.all("*", (req, res, next) => {
    console.log("TO DO: ROUTE");
    next("ERROR");
});

module.exports = app;
const express = require("express");
const baseUrl = "/api/v1";
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const app = express();
const teamsRouter = require("./routes/teamsRoutes");
const userRouter = require("./routes/userRoutes");

app.use(helmet());

// Limit requests calls from API
const limiter = rateLimit({
    max: 100, // 100 calls
    windowMs: 60 * 60 * 1000, //1hr
    message: "Too many request from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body Parser, reading data from the body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(cors());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

//Prevent parameter polution
app.use(
    hpp({
        whitelist: [
            "duration",
            "ratingsQuantity",
            "ratingsAverage",
            "maxGroupSize",
            "difficulty",
            "price",
        ],
    })
);

app.use(`${baseUrl}/teams`, teamsRouter);
app.use(`${baseUrl}/users`, userRouter);

app.all("*", (req, res, next) => {
    console.log("TO DO: ROUTE");
    next("ERROR");
});

module.exports = app;
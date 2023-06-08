const express = require("express");
const baseUrl = "/api/v1";
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const app = express();

// Routers
const teamsRouter = require("./routes/teamsRoutes");
const userRouter = require("./routes/userRoutes");
const tournamentsRouter = require("./routes/tournamentsRoutes");
const teamStatisticsRouter = require("./routes/statistics/teamStatisticsRoutes");
const tournamentStatisticsRouter = require("./routes/statistics/tournamentStatisticsRoutes");

app.use(helmet());

// Limit requests calls from API
const limiter = rateLimit({
  max: 10000, // 100 calls
  windowMs: 60 * 60 * 1000, //1hr
  message: "Too many request from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body Parser, reading data from the body into req.body
app.use(express.json({ limit: "50mb" }));
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
app.use(`${baseUrl}/tournaments`, tournamentsRouter);
app.use(`${baseUrl}/team/statistics`, teamStatisticsRouter);
app.use(`${baseUrl}/tournament/statistics`, tournamentStatisticsRouter);

app.all("*", (req, res, next) => {
  console.log(req.url);
  console.log("TO DO: ROUTE :C");
  next("ERROR");
});

module.exports = app;

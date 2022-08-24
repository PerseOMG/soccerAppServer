const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");

// Settings
const port = process.env.PORT || 3000;

const DB_URL = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PSSWD
);

mongoose.connect(DB_URL).then(() => console.log("CONNECTED TO CLOUD DB"));

app.listen(port, () => {
    console.log("Server listening on port ", port);
});
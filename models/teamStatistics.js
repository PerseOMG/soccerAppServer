const mongoose = require("mongoose");

const teamStatisticsSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.ObjectId,
        ref: "Team",
        required: true,
    },
    matchesData: [{
        type: {
            teamAgainst: {
                type: mongoose.Schema.ObjectId,
                ref: "Team",
                required: true,
            },
            goalsInFavor: {
                type: Number,
                default: 0,
                required: true,
            },
            goalsAgainst: {
                type: Number,
                required: true,
                default: 0,
            },
            gamesWon: {
                type: Number,
                required: true,
                default: 0,
            },
            gamesLoosed: {
                type: Number,
                required: true,
                default: 0,
            },
            gamesTied: {
                type: Number,
                required: true,
                default: 0,
            },
        },
        default: null,
    }, ],
    finalsData: {
        type: {
            finalsWon: {
                type: Number,
                required: true,
                default: 0,
            },
            finalsLoosed: {
                type: Number,
                required: true,
                default: 0,
            },
            finalsWonAgainst: [{
                type: mongoose.Schema.ObjectId,
                ref: "Team",
                required: true,
            }, ],
            finalsLoosedAgainst: [{
                type: mongoose.Schema.ObjectId,
                ref: "Team",
                required: true,
            }, ],
        },
        default: null,
    },
});

const TeamStatistics = mongoose.model("teamStatistics", teamStatisticsSchema);

module.exports = TeamStatistics;
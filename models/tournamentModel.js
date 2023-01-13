const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [
            true,
            "Please enter another name for the tournament. Name already taken.",
        ],
        trim: true,
    },
    photo: {
        type: String,
    },
    currentEdition: {
        type: Number,
    },
    teams: [{
        type: mongoose.Schema.ObjectId,
        ref: "Team",
    }, ],
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    editionStatistics: {
        type: {
            totalGoalsScored: Number,
            maxGoalsScorer: {
                logo: String,
                name: String,
                value: Number,
            },
            lessGoalsScorer: {
                logo: String,
                name: String,
                value: Number,
            },
            moreGoalsAgainst: {
                logo: String,
                name: String,
                value: Number,
            },
            lessGoalsAgainst: {
                logo: String,
                name: String,
                value: Number,
            },
        },
    },
    historicalStatistics: {
        type: {
            moreChampionshipsWon: {
                logo: String,
                name: String,
                value: Number,
            },
            moreMatchesPlayed: {
                logo: String,
                name: String,
                value: Number,
            },
        },
    },
    positionTable: {
        type: {
            totalGoalsScored: Number,
            maxGoalsScorer: {
                logo: String,
                name: String,
                value: Number,
            },
            lessGoalsScorer: {
                logo: String,
                name: String,
                value: Number,
            },
            moreGoalsAgainst: {
                logo: String,
                name: String,
                value: Number,
            },
            lessGoalsAgainst: {
                logo: String,
                name: String,
                value: Number,
            },
        },
    },
});

tournamentSchema.pre(/^find/, function(next) {
    this.lean().populate({
        path: "teams",
        select: "id name logo",
    });

    next();
});

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = Tournament;
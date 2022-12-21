const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, "Please enter a valid name"],
        trim: true,
    },
    photo: {
        type: String,
    },
    currentEdition: {
        type: Number,
    },
    players: {
        type: Array,
    },
    userId: {
        type: String,
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

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = Tournament;
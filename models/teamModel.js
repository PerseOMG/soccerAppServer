const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ["A team must have a name"],
        unique: true,
        trim: true,
        maxlength: [20, "A tour name must have less or equal than 20 characters"],
        minlength: [4, "A tour name must have more or equal than 5 characters"],
    },
    logo: {
        type: String,
        required: true,
        unique: true,
    },
    tournaments: [{
        type: mongoose.Schema.ObjectId,
        ref: "Tournament",
    }, ],
    totalGoalsScored: {
        type: Number,
        default: 0,
    },
    totalGoalsAgainst: {
        type: Number,
        default: 0,
    },
    totalChampionships: [{
        type: {
            tournament: {
                type: mongoose.Schema.ObjectId,
                ref: "Tournament",
                default: null,
            },
            value: {
                type: Number,
                default: null,
            },
            edition: {
                type: String,
                default: null,
            },
        },
        default: null,
    }, ],
    totalGamesPlayed: {
        type: Number,
        default: 0,
    },
    totalGamesWon: {
        type: Number,
        default: 0,
    },
    totalGamesLoosed: {
        type: Number,
        default: 0,
    },
    bestWin: {
        type: String,
        default: "NA",
    },
    worstLose: {
        type: String,
        default: "NA",
    },
    totalLoosedFinals: {
        type: Number,
        default: 0,
    },
    bestWinningStreak: {
        type: Number,
        default: 0,
    },
    actualWinningStreak: {
        type: Number,
        default: 0,
    },
    lastWin: {
        type: String,
        default: "NA",
    },
    bestLoosingStreak: {
        type: Number,
        default: 0,
    },
    actualLoosingStreak: {
        type: Number,
        default: 0,
    },
    lastDefeat: {
        type: String,
        default: "NA",
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

teamSchema.virtual("goalsDiff").get(function() {
    return this.totalGoalsScored - this.totalGoalsAgainst;
});

teamSchema.virtual("totalTiedGames").get(function() {
    return this.totalGamesPlayed - this.totalGamesWon - this.totalGamesLoosed;
});

teamSchema.virtual("totalTournaments").get(function() {
    return this.tournaments ? this.tournaments.length : null;
});

teamSchema.virtual("goalsAverage").get(function() {
    return this.totalGamesPlayed != 0 ?
        this.totalGoalsScored / this.totalGamesPlayed :
        0;
});

teamSchema.virtual("goalsAgainstAverage").get(function() {
    return this.totalGamesPlayed != 0 ?
        this.totalGoalsAgainst / this.totalGamesPlayed :
        0;
});

teamSchema.virtual("wonGamesAverage").get(function() {
    return this.totalGamesPlayed != 0 ?
        this.totalGamesWon / this.totalGamesPlayed :
        0;
});

teamSchema.virtual("loosedGamesAverage").get(function() {
    return this.totalGamesPlayed != 0 ?
        this.totalGamesLoosed / this.totalGamesPlayed :
        0;
});

teamSchema.virtual("wonLoosedRatio").get(function() {
    return this.totalGamesLoosed != 0 ?
        this.totalGamesWon / this.totalGamesLoosed :
        0;
});

teamSchema.pre(/^find/, function(next) {
    this.lean().populate({
        path: "tournaments",
        select: "_id name photo -teams -positionTable.team ",
    });
    next();
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
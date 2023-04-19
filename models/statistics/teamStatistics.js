const mongoose = require("mongoose");
const { matchStatisticsSchema } = require("./tournamentStatistics");

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
            gamesLost: {
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
            finalsLOST: {
                type: Number,
                required: true,
                default: 0,
            },
            finalsWonAgainst: [{
                type: mongoose.Schema.ObjectId,
                ref: "Team",
                required: true,
            }, ],
            finalsLOSTAgainst: [{
                type: mongoose.Schema.ObjectId,
                ref: "Team",
                required: true,
            }, ],
        },
        default: null,
    },
    teamHistoricalData: {
        totalGoalsScored: {
            type: Number,
            default: 0,
        },
        totalGoalsAgainst: {
            type: Number,
            default: 0,
        },
        totalGamesPlayed: {
            type: Number,
            default: 0,
        },
        totalGamesWon: {
            type: Number,
            default: 0,
        },
        totalGamesLost: {
            type: Number,
            default: 0,
        },
        bestWin: matchStatisticsSchema,
        worstLose: matchStatisticsSchema,
        lastWin: matchStatisticsSchema,
        lastDefeat: matchStatisticsSchema,

        bestWinningStreak: {
            type: Number,
            default: 0,
        },
        actualWinningStreak: {
            type: Number,
            default: 0,
        },
        bestLoosingStreak: {
            type: Number,
            default: 0,
        },
        actualLoosingStreak: {
            type: Number,
            default: 0,
        },
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

teamStatisticsSchema.virtual("teamHistoricalData.goalsDiff").get(function() {
    return (
        this.teamHistoricalData.totalGoalsScored -
        this.teamHistoricalData.totalGoalsAgainst
    );
});

teamStatisticsSchema
    .virtual("teamHistoricalData.totalTiedGames")
    .get(function() {
        return (
            this.teamHistoricalData.totalGamesPlayed -
            this.teamHistoricalData.totalGamesWon -
            this.teamHistoricalData.totalgamesLost
        );
    });

teamStatisticsSchema
    .virtual("teamHistoricalData.goalsAverage")
    .get(function() {
        return this.teamHistoricalData.totalGamesPlayed != 0 ?
            this.teamHistoricalData.totalGoalsScored /
            this.teamHistoricalData.totalGamesPlayed :
            0;
    });

teamStatisticsSchema
    .virtual("teamHistoricalData.goalsAgainstAverage")
    .get(function() {
        return this.teamHistoricalData.totalGamesPlayed != 0 ?
            this.teamHistoricalData.totalGoalsAgainst /
            this.teamHistoricalData.totalGamesPlayed :
            0;
    });

teamStatisticsSchema
    .virtual("teamHistoricalData.wonGamesAverage")
    .get(function() {
        return this.teamHistoricalData.totalGamesPlayed != 0 ?
            this.teamHistoricalData.totalGamesWon /
            this.teamHistoricalData.totalGamesPlayed :
            0;
    });

teamStatisticsSchema
    .virtual("teamHistoricalData.LOSTGamesAverage")
    .get(function() {
        return this.teamHistoricalData.totalGamesPlayed != 0 ?
            this.teamHistoricalData.totalgamesLost /
            this.teamHistoricalData.totalGamesPlayed :
            0;
    });

teamStatisticsSchema
    .virtual("teamHistoricalData.wonLOSTRatio")
    .get(function() {
        return this.teamHistoricalData.totalgamesLost != 0 ?
            this.teamHistoricalData.totalGamesWon /
            this.teamHistoricalData.totalgamesLost :
            0;
    });

const TeamStatistics = mongoose.model("teamStatistics", teamStatisticsSchema);

module.exports = TeamStatistics;
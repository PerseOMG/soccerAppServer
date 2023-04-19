const mongoose = require("mongoose");

const teamStatisticsSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.ObjectId,
        ref: "Team",
    },
    value: {
        type: Number,
        default: 0,
    },
});

const matchStatisticsSchema = new mongoose.Schema({
    winner: {
        type: mongoose.Schema.ObjectId,
        ref: "Team",
    },
    looser: {
        type: mongoose.Schema.ObjectId,
        ref: "Team",
    },
    winnerScore: {
        type: Number,
        default: 0,
    },
    looserScore: {
        type: Number,
        default: 0,
    },
});

const statisticsSchema = new mongoose.Schema({
    tournamentId: {
        type: mongoose.Schema.ObjectId,
        ref: "Tournament",
        required: true,
    },
    currentEdition: {
        type: Number,
        required: true,
        default: 1,
    },
    totalGoalsScored: {
        type: Number,
        default: 0,
    },
    maxGoalsScorer: teamStatisticsSchema,
    lessGoalsScorer: teamStatisticsSchema,
    moreGoalsAgainst: teamStatisticsSchema,
    lessGoalsAgainst: teamStatisticsSchema,
    moreGamesLost: teamStatisticsSchema,
    moreGamesWon: teamStatisticsSchema,
    moreGamesTied: teamStatisticsSchema,
    moreChampionshipsWon: teamStatisticsSchema,
    moreMatchesPlayed: teamStatisticsSchema,
    bestWin: matchStatisticsSchema,
});

const TournamentHistoricalStatistics = mongoose.model(
    "tournamentHistoricalStatistics",
    statisticsSchema
);

const TournamentEditionStatistics = mongoose.model(
    "tournamentEditionStatistics",
    statisticsSchema
);

module.exports = {
    TournamentHistoricalStatistics,
    TournamentEditionStatistics,
    matchStatisticsSchema,
};
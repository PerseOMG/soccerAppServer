const mongoose = require("mongoose");
const Team = require("../models/teamModel");

const teamStatisticsSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.ObjectId,
        ref: "Team",
        default: null,
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
        default: null,
    },
    looser: {
        type: mongoose.Schema.ObjectId,
        ref: "Team",
        default: null,
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
    currentEdition: {
        type: Number,
        required: true,
    },
    totalGoalsScored: {
        type: Number,
        default: 0,
    },
    maxGoalsScorer: teamStatisticsSchema,
    lessGoalsScorer: teamStatisticsSchema,
    moreGoalsAgainst: teamStatisticsSchema,
    lessGoalsAgainst: teamStatisticsSchema,
    moreGamesLoosed: teamStatisticsSchema,
    moreGamesWon: teamStatisticsSchema,
    moreGamesTied: teamStatisticsSchema,
    moreChampionshipsWon: teamStatisticsSchema,
    moreMatchesPlayed: teamStatisticsSchema,
    bestWin: matchStatisticsSchema,
    worstLoose: matchStatisticsSchema,
});

function arrayLimit(val) {
    return val.length <= 5;
}

const teamPositionTableData = new mongoose.Schema({
    team: {
        type: mongoose.Schema.ObjectId,
        ref: "Team",
        required: true,
    },
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    gamesTied: { type: Number, default: 0 },
    gamesLoosed: { type: Number, default: 0 },
    goalsScored: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    goalsDiff: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    // L | T | W | NA
    lastFiveScores: {
        type: Array,
        default: ["NA", "NA", "NA", "NA", "NA"],
        validate: arrayLimit,
    },
});

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
    teams: [{
        type: mongoose.Schema.ObjectId,
        ref: "Team",
        required: true,
    }, ],
    userId: {
        type: mongoose.Schema.ObjectId,
    },
    isEditionComplete: {
        type: Boolean,
        default: true,
    },
    editionStatistics: statisticsSchema,
    historicalStatistics: statisticsSchema,
    positionTable: [teamPositionTableData],
    calendar: {
        type: [{
            edition: { type: Number, required: true },
            matches: [{
                local: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Team",
                    required: true,
                },
                visit: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Team",
                    required: true,
                },
                hasBeenPlayed: {
                    type: Boolean,
                    default: false,
                },
                score: {
                    type: String,
                    required: true,
                    default: "0 - 0",
                },
            }, ],
        }, ],
    },
});

tournamentSchema.pre(/^find/, function(next) {
    this.lean()
        .populate({
            path: "teams",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.maxGoalsScorer.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.lessGoalsScorer.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.moreGoalsAgainst.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.lessGoalsAgainst.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.moreGamesLoosed.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.moreGamesWon.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.moreGamesTied.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.moreChampionshipsWon.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.moreMatchesPlayed.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.bestWin.winner",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.bestWin.looser",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.worstLoose.winner",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "editionStatistics.worstLoose.looser",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.maxGoalsScorer.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.lessGoalsScorer.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.moreGoalsAgainst.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.lessGoalsAgainst.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.moreGamesLoosed.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.moreGamesWon.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.moreGamesTied.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.moreChampionshipsWon.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.moreMatchesPlayed.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.bestWin.winner",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.bestWin.looser",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.worstLoose.winner",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "historicalStatistics.worstLoose.looser",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "positionTable.team",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "calendar.matches.local",
            select: "id name logo -tournaments",
        })
        .populate({
            path: "calendar.matches.visit",
            select: "id name logo -tournaments",
        });

    next();
});

tournamentSchema.pre("save", function(next) {
    // Creates position table
    this.teams.forEach((team) => {
        this.positionTable.push(
            new TeamPositionTableData({
                team: team.toString(),
            })
        );
    });

    // Creates calendar for teams
    this.teams.forEach((team, idx) => {
        const matches = [];
        for (let i = idx; i < this.teams.length - 1; i++) {
            matches.push({
                local: team.toString(),
                visit: this.teams[i + 1].toString(),
                hasBeenPlayed: false,
                score: "0 - 0",
            });
        }
        if (idx + 1 !== this.teams.length)
            this.calendar.push({
                edition: idx + 1,
                matches,
            });
    });
    // Assign new tournament to teams
    this.teams.forEach(async(teamId) => {
        await Team.findById(teamId.toString())
            .exec()
            .then(async(team) => {
                Team.findByIdAndUpdate(team._id, {
                        ...team,
                        tournaments: [...team.tournaments, this._id],
                    })
                    .exec()
                    .then(() => next());
            });
    });
});

tournamentSchema.pre("deleteOne", { document: true }, async function(next) {
    this.teams.forEach(async(teamId) => {
        await Team.findById(teamId.toString())
            .exec()
            .then(async(team) => {
                Team.findByIdAndUpdate(team._id, {
                        ...team,
                        tournaments: team.tournaments.filter(
                            (teamId) => teamId.toString() !== this._id.toString()
                        ),
                    })
                    .exec()
                    .then(() => next());
            });
    });
});

const TeamPositionTableData = mongoose.model(
    "TeamPositionTableData",
    teamPositionTableData
);

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = { Tournament, TeamPositionTableData };
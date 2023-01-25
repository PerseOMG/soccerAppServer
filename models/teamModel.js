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
            edition: [{
                type: String,
                default: null,
            }, ],
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
        select: "_id name photo -teams -positionTable.team  ",
    });
    next();
});

teamSchema.pre("save", function(next) {
    const { Tournament, TeamPositionTableData } = require("./tournamentModel");

    // Assign new team to tournaments
    this.tournaments.forEach(async(tournamentId) => {
        await Tournament.findById(tournamentId.toString())
            .exec()
            .then(async(tournament) => {
                tournament.calendar = [];
                [...tournament.teams, { _id: this._id }].forEach((team, idx) => {
                    const matches = [];
                    for (let i = idx; i < tournament.teams.length; i++) {
                        matches.push({
                            local: team._id.toString(),
                            visit: [...tournament.teams, { _id: this._id }][
                                i + 1
                            ]._id.toString(),
                            hasBeenPlayed: false,
                            score: "0 - 0",
                        });
                    }
                    if (idx !== tournament.teams.length)
                        tournament.calendar.push({
                            edition: idx + 1,
                            matches,
                        });
                });
                Tournament.findByIdAndUpdate(tournament._id, {
                        ...tournament,
                        teams: [...tournament.teams, this._id],
                        positionTable: [
                            ...tournament.positionTable,
                            new TeamPositionTableData({ team: this._id.toString() }),
                        ],
                    })
                    .exec()
                    .then(() => next());
            });
    });
});

teamSchema.pre("deleteOne", async function(next) {
    const team = await this.model.findOne(this.getQuery());

    const { Tournament, TeamPositionTableData } = require("./tournamentModel");
    // Assign new team to tournaments
    team.tournaments.forEach(async(tournament) => {
        await Tournament.findById(tournament._id.toString())
            .exec()
            .then(async(tournament) => {
                tournament.calendar = [];
                tournament.teams.forEach((teamFromTournament, idx) => {
                    let matches = [];
                    if (teamFromTournament._id.toString() !== team._id.toString()) {
                        for (let i = idx; i < tournament.teams.length; i++) {
                            if (tournament.teams[i + 1] && tournament.teams[idx]) {
                                matches.push({
                                    local: tournament.teams[idx]._id.toString(),
                                    visit: tournament.teams[i + 1]._id.toString(),
                                    hasBeenPlayed: false,
                                    score: "0 - 0",
                                });
                            }
                        }
                        matches = matches.filter(
                            (match) =>
                            match.local !== team._id.toString() &&
                            match.visit !== team._id.toString()
                        );

                        if (idx !== tournament.teams.length && matches.length !== 0) {
                            tournament.calendar.push({
                                edition: idx + 1,
                                matches,
                            });
                        }
                    }
                });
                Tournament.findByIdAndUpdate(tournament._id, {
                        name: tournament.name,
                        photo: tournament.photo,
                        userId: tournament.userId,
                        editionStatistics: tournament.editionStatistics,
                        historicalStatistics: tournament.historicalStatistics,
                        calendar: tournament.calendar,
                        isEditionComplete: tournament.isEditionComplete,
                        teams: tournament.teams.filter(
                            (teamFromTournament) => teamFromTournament._id !== team._id
                        ),
                        positionTable: tournament.positionTable.filter(
                            (tableData) => tableData.team
                        ),
                    })
                    .exec()
                    .then(() => next());
            });
    });
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
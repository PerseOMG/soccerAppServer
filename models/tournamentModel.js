const mongoose = require("mongoose");
const Team = require("../models/teamModel");
const {
  TournamentHistoricalStatistics,
  TournamentEditionStatistics,
} = require("./statistics/tournamentStatistics");
const teamPositionTableData = new mongoose.Schema({
  team: {
    type: mongoose.Schema.ObjectId,
    ref: "Team",
    required: true,
  },
  gamesPlayed: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  gamesTied: { type: Number, default: 0 },
  gamesLost: { type: Number, default: 0 },
  goalsScored: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  goalsDiff: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  // L | T | W | NA
  lastFiveScores: {
    type: Array,
    default: ["NA", "NA", "NA", "NA", "NA"],
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
  logo: {
    type: String,
  },
  teams: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
      required: true,
    },
  ],
  userId: {
    type: mongoose.Schema.ObjectId,
  },
  edition: { type: Number, required: true, default: 1 },
  isEditionComplete: {
    type: Boolean,
    default: false,
  },
  options: {
    type: {
      winnerDefinition: {
        type: String, // points || playoffs
        required: true,
      },
      playoffsQuantity: Number, // 10 | 8 | 6 | 4 | 2
    },
  },
  positionTable: [teamPositionTableData],
  bonus: {
    type: {
      champion: {
        type: String,
        default: null,
      },
      lastPosition: {
        type: String,
        default: null,
      },
      subChamp: {
        type: String,
        default: null,
      },
      winRates: [
        {
          type: [String],
          default: null,
        },
      ],
      looseRates: [
        {
          type: [String],
          default: null,
        },
      ],
    },
  },
  calendar: {
    type: [
      {
        edition: { type: Number, required: true, default: 1 },
        matches: [
          {
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
          },
        ],
      },
    ],
  },
});

tournamentSchema.pre(/^find/, function (next) {
  this.lean()
    .populate({
      path: "teams",
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

tournamentSchema.pre("save", async function (next) {
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
  this.teams.forEach(async (teamId) => {
    await Team.findById(teamId.toString())
      .exec()
      .then(async (team) => {
        Team.findByIdAndUpdate(team._id, {
          ...team,
          tournaments: team.tournaments
            ? [...team.tournaments, this._id]
            : [this._id],
        })
          .exec()
          .then(() => next());
      });
  });
});

tournamentSchema.pre("deleteOne", { document: true }, async function (next) {
  // deletes tournament from teams reference
  this.teams.forEach(async (teamId) => {
    await Team.findById(teamId.toString())
      .exec()
      .then(async (team) => {
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

tournamentSchema.post("save", async function () {
  // Creates Statistics Historical And Edition for tournament, do not delete when tournament deleted
  await TournamentEditionStatistics.create({ tournamentId: this._id });
  await TournamentHistoricalStatistics.create({ tournamentId: this._id });
});

const TeamPositionTableData = mongoose.model(
  "TeamPositionTableData",
  teamPositionTableData
);

const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = { Tournament, TeamPositionTableData };

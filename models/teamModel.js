const mongoose = require("mongoose");
const teamSchema = new mongoose.Schema(
  {
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
    isFavorite: { type: Boolean, default: false },
    tournaments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tournament",
      },
    ],
    totalChampionships: [
      {
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
          edition: [
            {
              type: String,
              default: null,
            },
          ],
        },
        default: null,
      },
    ],
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

teamSchema.pre(/^find/, function (next) {
  this.lean().populate({
    path: "tournaments totalChampionships.tournament totalChampionships.edition totalChampionships.value",
    select:
      "_id name logo -teams -positionTable.team -calendar.matches.local -calendar.matches.visit",
  });
  next();
});

teamSchema.pre("save", async function (next) {
  const { Tournament, TeamPositionTableData } = require("./tournamentModel");

  // Assign new team to tournaments
  if (this.tournaments) {
    this.tournaments.forEach(async (tournamentId) => {
      await Tournament.findById(tournamentId.toString())
        .exec()
        .then(async (tournament) => {
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
  }
});

teamSchema.pre("deleteOne", async function (next) {
  const team = await this.model.findOne(this.getQuery());

  const { Tournament } = require("./tournamentModel");
  // Assign new team to tournaments
  if (team.tournaments) {
    team.tournaments.forEach(async (tournament) => {
      await Tournament.findById(tournament._id.toString())
        .exec()
        .then(async (tournament) => {
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
            logo: tournament.logo,
            userId: tournament.userId,
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
  }
});

teamSchema.post("save", async function () {
  const teamStatistics = require("./statistics/teamStatistics");
  // creates teamStatistics, do not delete when team is deleted
  await teamStatistics.create({ team: this._id });
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;

const catchAsync = require("../../utils/catchAsync.util");
const AppError = require("../../utils/appError.util");
const TeamStatistics = require("../../models/statistics/teamStatistics");

exports.getTeamStatistics = catchAsync(async (req, res, next) => {
  const ids = req.params.id.split(",");
  let teamsStatistics = [];

  await Promise.all(
    ids.map(async (id) => {
      await TeamStatistics.find({ team: id })
        .exec()
        .then((team) => {
          if (!team || team.length === 0) {
            return res.status(400).json({
              status: "fail",
              message: `team with id ${id} does not exist`,
            });
          } else {
            teamsStatistics.push(team);
          }
        });
    })
  );

  // Delete empty arrays from id's not found
  teamsStatistics = teamsStatistics.map((team) => {
    if (team.length > 0) return team[0];
  });

  if (!teamsStatistics || teamsStatistics.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No statistics found with ID's provided",
    });
  }

  res.status(200).json({
    status: "success",
    data: { teamsStatistics },
  });
});

exports.updateTeamStatistics = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const teamStatistics = await TeamStatistics.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!teamStatistics) {
    return new AppError("No team found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    data: { teamStatistics },
  });
});

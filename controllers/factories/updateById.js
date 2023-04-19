const updateById = async (Model, id, body) => {
  return await Model.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
};

module.exports = updateById;

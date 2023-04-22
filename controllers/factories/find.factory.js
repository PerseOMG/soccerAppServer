const findModel = async (Model, findObj, optionFields) => {
  return await Model.find(findObj, optionFields);
};

module.exports = findModel;

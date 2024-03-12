function getFilterObject(Model, queryString) {
  const queryObj = { ...queryString };
  const excludedFields = ["page", "sort", "limit", "fields", "populate"];
  const modelFields = Object.keys(Model.schema.paths);

  excludedFields.forEach((el) => delete queryObj[el]);

  for (const field of Object.keys(queryObj)) {
    modelFields.includes(field) || delete queryObj[field];
  }
  // 1B) Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  return JSON.parse(queryStr);
}

module.exports = getFilterObject;

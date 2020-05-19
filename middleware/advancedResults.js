const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  const queryCopy = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];

  removeFields.forEach((field) => delete queryCopy[field]);

  let queryString = JSON.stringify(queryCopy);
  queryString = queryString.replace(
    /\b(gte|eq|in|lt|lte|gt)\b/g,
    (match) => `$${match}`
  );

  //Queries
  query = model.find(JSON.parse(queryString));

  console.log(queryString);
  console.log(query);

  //Selecting
  if (req.query.select) {
    let selected = req.query.select.split(",").join(" ");
    query = query.select(selected);
  }

  //Sorting
  if (req.query.sort) {
    let sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const start = (page - 1) * limit; // 25
  const end = page * limit; // 50
  const total = await model.countDocuments();

  query = query.skip(start).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

  let Pagination = {};

  if (end < total) {
    Pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (start > 0) {
    Pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    Pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;

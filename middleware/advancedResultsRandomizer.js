const advancedResultsRandomizer = (model, populate) => async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit", "keyword"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Adding keyword search functionality
  if (req.query.keyword) {
    const keyword = req.query.keyword;
  
    // Add the keyword search condition to the query
    queryStr = JSON.parse(queryStr);
    queryStr.$or = [
      {  category: { $regex: keyword, $options: "i" } },
      {  status : { $regex: keyword, $options: "i" } },
      {  region : { $regex: keyword, $options: "i" } },
      {  city : { $regex: keyword, $options: "i" } },
      {  postTitle : { $regex: keyword, $options: "i" } }
    ]; 
 
    queryStr = JSON.stringify(queryStr);
  }


  // Finding resource
  query = model.find(JSON.parse(queryStr));


  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    // query = query.sort("-createdAt");
    query = query.sort("createdAt");
  }

  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }


  // Executing query
  const results = await query;

   // Custom Sorting Logic
   const packageOrder = {
    enterprise: 1,
    diamond: 2,
    gold: 3,
    premium: 4,
    regular: 5,
    basic: 6,
  };

  results.sort((a, b) => {
    // const packageA = a.packageType.toLowerCase();
    // const packageB = b.packageType.toLowerCase();

    const packageA = (a.packageType || '').toLowerCase(); 
    const packageB = (b.packageType || '').toLowerCase();  

    return packageOrder[packageA] - packageOrder[packageB];
  });

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResultsRandomizer;

// const WaitList = require("../models/WaitList");
// const ErrorResponse = require("../utils/errorResponse");
// const asyncHandler = require("../middleware/async");

// // @desc      Create user
// // @route     GET /api/v1/cites
// // @access    Private/Admin
// exports.getWaitList = asyncHandler(async (req, res, next) => {
//   await res.status(200).json(res.advancedResults);
// });


// // @desc      Create Cities
// // @route     POST /api/v1/cites
// // @access    Private/Admin
// exports.createWaitList = asyncHandler(async (req, res, next) => {
//   const { name, email, accountType, mobile, question } = req.body;
//   const userExists = await WaitList.findOne({ email });

//   if (userExists) {
//     return next(new ErrorResponse("Email Account already joined waitList", 400));
//   }

//    // Create the waitlist entry
//    const waitlistEntry = await WaitList.create({
//     name,
//     email,
//     accountType,
//     mobile,
//     question
//   });

//   // Send a response with the created waitlist entry
//   res.status(201).json({
//     success: true,
//     data: waitlistEntry,
//   });
// });



// // @desc      Delete user
// // @route     DELETE /api/v1/waitlist/delete-all
// // @access    Private/Admin
// exports.deleteAll = asyncHandler(async (req, res, next) => {
//     await WaitList.deleteMany();
  
//     res.status(200).json({
//       success: true,
//       data: {}
//     });
//   });
  
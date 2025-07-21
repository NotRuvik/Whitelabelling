const Cause = require("../models/cause.model");
const Missionary = require("../models/missionary.model"); // To verify missionary exists in the org
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const path = require("path");
const mongoose = require("mongoose");
const createCause = async (req, res, next) => {
  try {
    const { organizationId, _id: userId, role } = req.user;
    let missionaryIdForCause;
    if (role === "npo_admin") {
      // If an admin is creating, they must specify the missionary
      const { missionaryId } = req.body;
      if (!missionaryId) {
        throw new ApiError(
          400,
          "Missionary ID is required when creating a cause as an admin."
        );
      }
      // Verify the specified missionary belongs to the admin's organization
      const missionary = await Missionary.findOne({
        _id: missionaryId,
        organizationId,
      });
      if (!missionary) {
        throw new ApiError(
          404,
          "Missionary not found within your organization."
        );
      }
      missionaryIdForCause = missionary._id;
    } else if (role === "missionary") {
      // If a missionary is creating, find their own missionary profile
      const missionaryProfile = await Missionary.findOne({ userId });
      if (!missionaryProfile) {
        throw new ApiError(
          404,
          "Could not find a missionary profile linked to your user account."
        );
      }
      missionaryIdForCause = missionaryProfile._id;
    } else {
      throw new ApiError(403, "You do not have permission to create a cause.");
    }

    const imagePaths = [];
    if (req.files && req.files.mainImage) {
      imagePaths.push(`/uploads/causes/${req.files.mainImage[0].filename}`);
    }
    if (req.files && req.files.otherImages) {
      req.files.otherImages.forEach((file) => {
        imagePaths.push(`/uploads/causes/${file.filename}`);
      });
    }
    if (req.body.categories) {
      req.body.ministryType = JSON.parse(req.body.categories);
      delete req.body.categories; // Optional cleanup
    }
    const videoUrl = req.body.videoUrl || "";
    const cause = new Cause({
      ...req.body,
      images: imagePaths,
      organizationId,
      videoUrl,
      createdBy: userId,
      missionaryId: missionaryIdForCause,
    });

    await cause.save();
    // 🎯 CREATE SUPER ADMIN NOTIFICATION
        try {
            // Find the missionary's user details to get their name
            const missionary = await Missionary.findById(missionaryIdForCause).populate({
                path: 'userId',
                select: 'firstName lastName'
            });

            if (missionary && missionary.userId) {
                const missionaryName = `${missionary.userId.firstName} ${missionary.userId.lastName}`;
                const message = `Cause '${cause.name}' was created by ${missionaryName}.`;
                await Notification.create({
                    recipientRole: 'super_admin',
                    message: message
                });
            }
        } catch (err) {
            console.error("Failed to create super admin notification for new cause:", err);
        }
    res
      .status(201)
      .json(new ApiResponse(201, cause, "Cause created successfully."));
  } catch (error) {
    next(error);
  }
};

const getCausesForMyOrg = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const causes = await Cause.find({ organizationId })
      .populate("missionaryId", "userId")
      .populate("createdBy", "firstName lastName");
    res.status(200).json(new ApiResponse(200, causes));
  } catch (error) {
    next(error);
  }
};

const getCauseById = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const { causeId } = req.params;

    const cause = await Cause.findOne({ _id: causeId, organizationId });
    if (!cause) {
      throw new ApiError(404, "Cause not found.");
    }
    res.status(200).json(new ApiResponse(200, cause));
  } catch (error) {
    next(error);
  }
};

const updateCause = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const { causeId } = req.params;

    const causeToUpdate = await Cause.findOne({ _id: causeId, organizationId });
    if (!causeToUpdate) {
      throw new ApiError(404, "Cause not found or you do not have permission to update it.");
    }

    const updates = { ...req.body };
    let finalImagePaths = [];

    // 1. Process existing images sent from the frontend
    if (req.body.existingImages) {
        // The frontend tells us which old images to keep.
        finalImagePaths = JSON.parse(req.body.existingImages);
    }
    
    // Find which images were removed to delete them from the server
    const originalImages = causeToUpdate.images || [];
    const imagesToDelete = originalImages.filter(img => !finalImagePaths.includes(img));
    
    imagesToDelete.forEach(imgPath => {
        // Construct full path and delete file. Use a try/catch to prevent crashes if file doesn't exist.
        try {
            fs.unlinkSync(path.join(__dirname, `../../../public${imgPath}`));
        } catch (err) {
            console.error(`Failed to delete old image: ${imgPath}`, err);
        }
    });

    // 2. Process newly uploaded files
    const uploadedImagePaths = [];
    if (req.files) {
        if (req.files.mainImage) {
            uploadedImagePaths.push(`/uploads/causes/${req.files.mainImage[0].filename}`);
        }
        if (req.files.otherImages) {
            req.files.otherImages.forEach(file => {
                uploadedImagePaths.push(`/uploads/causes/${file.filename}`);
            });
        }
    }
    
    // 3. Combine kept images and new images
    // New main image (if any) goes to the front, followed by kept images, then new other images.
    if (req.files && req.files.mainImage) {
        // If a new main image is uploaded, it replaces the old one at the start of the array.
        finalImagePaths.shift(); // Remove old main image placeholder
        finalImagePaths.unshift(`/uploads/causes/${req.files.mainImage[0].filename}`);
    }
    if (req.files && req.files.otherImages) {
        finalImagePaths.push(...req.files.otherImages.map(f => `/uploads/causes/${f.filename}`));
    }
    
    updates.images = finalImagePaths;

    // Update categories
    if (req.body.categories) {
      updates.ministryType = JSON.parse(req.body.categories);
      delete updates.categories;
    }
    
    // Update the cause document
    Object.assign(causeToUpdate, updates);
    const updatedCause = await causeToUpdate.save();

    res.status(200).json(new ApiResponse(200, updatedCause, "Cause updated successfully."));
  } catch (error) {
    next(error);
  }
};
const deleteCause = async (req, res, next) => {
  try {
    const { organizationId } = req.user;
    const { causeId } = req.params;

    const result = await Cause.deleteOne({ _id: causeId, organizationId });

    if (result.deletedCount === 0) {
      throw new ApiError(
        404,
        "Cause not found or you do not have permission to delete it."
      );
    }
    res
      .status(200)
      .json(new ApiResponse(200, null, "Cause deleted successfully."));
  } catch (error) {
    next(error);
  }
};

// const getPublicCauses = async (req, res, next) => {
//   try {
//     const {
//       search,
//       ministryType,
//       isCompleted,
//       location,
//       page = 1,
//       limit = 9,
//     } = req.query;

//     const pageNum = parseInt(page, 10);
//     const limitNum = parseInt(limit, 10);
//     const skip = (pageNum - 1) * limitNum;

//     const pipeline = [];

//     // --- Stage 1 & 2: Initial Match and Joins
//     const initialMatch = { isActive: true };
//     if (ministryType) initialMatch.ministryType = ministryType;
//     if (isCompleted === "true") initialMatch.isCompleted = true;
//     else initialMatch.isCompleted = { $ne: true };
//     pipeline.push({ $match: initialMatch });

//     pipeline.push({
//       $lookup: {
//         from: "missionaries",
//         localField: "missionaryId",
//         foreignField: "_id",
//         as: "missionaryDoc",
//       },
//     });
//     pipeline.push({
//       $unwind: { path: "$missionaryDoc", preserveNullAndEmptyArrays: true },
//     });
//     pipeline.push({
//       $lookup: {
//         from: "users",
//         localField: "missionaryDoc.baseId",
//         foreignField: "_id",
//         as: "baseInfo",
//       },
//     });
//     pipeline.push({
//       $unwind: { path: "$baseInfo", preserveNullAndEmptyArrays: true },
//     });
//     pipeline.push({
//       $lookup: {
//         from: "users",
//         localField: "missionaryDoc.userId",
//         foreignField: "_id",
//         as: "missionaryUserInfo",
//       },
//     });
//     pipeline.push({
//       $unwind: {
//         path: "$missionaryUserInfo",
//         preserveNullAndEmptyArrays: true,
//       },
//     });

//     pipeline.push({
//       $addFields: {
//         missionaryFullName: {
//           $concat: [
//             "$missionaryUserInfo.firstName",
//             " ",
//             "$missionaryUserInfo.lastName",
//           ],
//         },
//       },
//     });

//     // --- Stage 3: The Main Filtering Logic ---
//     const secondaryMatch = {};
//     if (location) {
//       secondaryMatch["baseInfo.location"] = location;
//     }

//     if (search) {
//       const searchRegex = new RegExp(search, "i");
//       secondaryMatch.$or = [
//         { name: searchRegex },
//         { missionaryFullName: searchRegex },
//         { "missionaryDoc.country": searchRegex },
//         { "missionaryDoc.continent": searchRegex },
//       ];
//     }

//     if (Object.keys(secondaryMatch).length > 0) {
//       pipeline.push({ $match: secondaryMatch });
//     }

//     // --- The rest of the pipeline remains the same ---
//     const countPipeline = [...pipeline, { $count: "total" }];
//     pipeline.push({
//       $project: {
//         _id: 1,
//         name: 1,
//         description: 1,
//         images: 1,
//         goalAmount: 1,
//         raisedAmount: 1,
//         ministryType: 1,
//         missionaryId: {
//           _id: "$missionaryDoc._id",
//           userId: {
//             _id: "$missionaryUserInfo._id",
//             firstName: "$missionaryUserInfo.firstName",
//             lastName: "$missionaryUserInfo.lastName",
//             location: "$baseInfo.location",
//           },
//         },
//       },
//     });
//     pipeline.push({ $sort: { createdAt: -1 } });
//     pipeline.push({ $skip: skip });
//     pipeline.push({ $limit: limitNum });

//     const [causes, countResult] = await Promise.all([
//       Cause.aggregate(pipeline),
//       Cause.aggregate(countPipeline),
//     ]);

//     const totalCauses = countResult[0]?.total || 0;
//     res.status(200).json(
//       new ApiResponse(
//         200,
//         {
//           data: causes,
//           pagination: {
//             currentPage: pageNum,
//             totalPages: Math.ceil(totalCauses / limitNum),
//             totalCauses,
//           },
//         },
//         "Causes fetched successfully."
//       )
//     );
//   } catch (error) {
//     next(error);
//   }
// };
const getPublicCauses = async (req, res, next) => {
  try {
    const {
      search,
      ministryType,
      isCompleted,
      location,
      missionaryId, // 👈 grab missionaryId from query
      page = 1,
      limit = 9,
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const pipeline = [];

    // --- Stage 1: Initial Filters
    const initialMatch = { isActive: true };
    if (ministryType) initialMatch.ministryType = ministryType;
    if (isCompleted === "true") initialMatch.isCompleted = true;
    else initialMatch.isCompleted = { $ne: true };
    if (missionaryId) initialMatch.missionaryId = new mongoose.Types.ObjectId(missionaryId); // 👈 filter by missionaryId

    pipeline.push({ $match: initialMatch });

    // --- Stage 2: Joins
    pipeline.push({
      $lookup: {
        from: "missionaries",
        localField: "missionaryId",
        foreignField: "_id",
        as: "missionaryDoc",
      },
    });
    pipeline.push({
      $unwind: {
        path: "$missionaryDoc",
        preserveNullAndEmptyArrays: true,
      },
    });
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "missionaryDoc.baseId",
        foreignField: "_id",
        as: "baseInfo",
      },
    });
    pipeline.push({
      $unwind: {
        path: "$baseInfo",
        preserveNullAndEmptyArrays: true,
      },
    });
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "missionaryDoc.userId",
        foreignField: "_id",
        as: "missionaryUserInfo",
      },
    });
    pipeline.push({
      $unwind: {
        path: "$missionaryUserInfo",
        preserveNullAndEmptyArrays: true,
      },
    });
    pipeline.push({
      $addFields: {
        missionaryFullName: {
          $concat: [
            "$missionaryUserInfo.firstName",
            " ",
            "$missionaryUserInfo.lastName",
          ],
        },
      },
    });

    // --- Stage 3: Optional Search/Location Filters
    const secondaryMatch = {};
    if (location) {
      secondaryMatch["baseInfo.location"] = location;
    }
    if (search) {
      const searchRegex = new RegExp(search, "i");
      secondaryMatch.$or = [
        { name: searchRegex },
        { missionaryFullName: searchRegex },
        { "missionaryDoc.country": searchRegex },
        { "missionaryDoc.continent": searchRegex },
      ];
    }
    if (Object.keys(secondaryMatch).length > 0) {
      pipeline.push({ $match: secondaryMatch });
    }

    // --- Pagination & Projection
    const countPipeline = [...pipeline, { $count: "total" }];

    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        images: 1,
        goalAmount: 1,
        raisedAmount: 1,
        ministryType: 1,
        missionaryId: {
          _id: "$missionaryDoc._id",
          userId: {
            _id: "$missionaryUserInfo._id",
            firstName: "$missionaryUserInfo.firstName",
            lastName: "$missionaryUserInfo.lastName",
            location: "$baseInfo.location",
          },
        },
      },
    });
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limitNum });

    const [causes, countResult] = await Promise.all([
      Cause.aggregate(pipeline),
      Cause.aggregate(countPipeline),
    ]);

    const totalCauses = countResult[0]?.total || 0;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          data: causes,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCauses / limitNum),
            totalCauses,
          },
        },
        "Causes fetched successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};

const getPublicCauseById = async (req, res, next) => {
  try {
    const { causeId } = req.params;
    const cause = await Cause.findOne({ _id: causeId, isActive: true })
      .populate({
        path: "missionaryId",
        select: "userId baseId",
        populate: { path: "userId", select: "firstName lastName location profilePhotoUrl" },
      })
      .lean();

    if (!cause) {
      throw new ApiError(404, "Public cause not found.");
    }

    res
      .status(200)
      .json(new ApiResponse(200, cause, "Cause fetched successfully."));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCause,
  getCausesForMyOrg,
  getCauseById,
  updateCause,
  deleteCause,
  getPublicCauses,
  getPublicCauseById,
};

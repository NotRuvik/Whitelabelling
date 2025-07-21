const missionaryService = require("../services/missionary.service");
const Missionary = require("../models/missionary.model");
const User = require("../models/user.model");
const ApiResponse = require("../utils/apiResponse");
const fs = require("fs");
const path = require("path");
const ApiError = require("../utils/apiError");

const addAndRegisterMissionary = async (req, res, next) => {
  try {
    const creator = req.user;
    const missionaryData = req.body;

    if (creator.role === "base_user") {
      missionaryData.baseId = creator._id;
    }

    // This call is correct. It passes two arguments.
    const newMissionary = await missionaryService.registerNewMissionary(
      missionaryData,
      creator
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newMissionary,
          "Missionary registered successfully. Credentials have been sent."
        )
      );
  } catch (error) {
    next(error);
  }
};

const setMissionaryStatus = async (req, res, next) => {
  try {
    const { missionaryId } = req.params;
    const { isActive } = req.body;
    const npoAdmin = req.user;

    const updatedMissionary = await missionaryService.updateMissionaryStatus(
      missionaryId,
      isActive,
      npoAdmin
    );
    const message = isActive
      ? "Missionary has been unblocked."
      : "Missionary has been blocked.";
    res.status(200).json(new ApiResponse(200, updatedMissionary, message));
  } catch (error) {
    next(error);
  }
};

// const getMissionariesForMyOrg = async (req, res, next) => {
//     try {
//       console.log("======>>>>>>>>>>>>>",req.query)
//         const { organizationId, role, _id: userId } = req.user;
        
//         let query = { organizationId };
//         if (role === 'base_user') {
//             // A base_user can only see missionaries assigned to their base
//             query.baseId = userId;
//         }

//         const missionaries = await Missionary.find(query).populate('userId', 'firstName lastName email')
//         .populate('baseId', 'location')
//         .sort({ createdAt: -1 });
//         res.status(200).json(new ApiResponse(200, missionaries));
//     } catch (error) {
//         next(error);
//     }
// };  
const getMissionariesForMyOrg = async (req, res, next) => {
    try {
        const { organizationId, role, _id: userId } = req.user;
        const { page = 1, perPage = 10, search = '', sortField = "", sortOrder = "asc" } = req.query;

        let filter = { organizationId };

        if (role === 'base_user') {
            filter.baseId = userId; // Base users only see their own base's missionaries
        }

        const missionariesData = await missionaryService.getAllMissionaries({
            page: Number(page),
            perPage: Number(perPage),
            search,
            sortField,
            sortOrder,
            filter // Pass additional filters
        });

        res.status(200).json(new ApiResponse(200, missionariesData)); // Send the structured data
    } catch (error) {
        next(error);
    }
};

const getMyProfile = async (req, res, next) => {
  try {
    // This is already correct from our last fix
    const missionary = await missionaryService.getMissionaryByUserId(req.user);
    res.status(200).json(new ApiResponse(200, missionary));
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const updatedMissionary = await missionaryService.updateMissionaryProfile(
      req.user,
      req.body
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedMissionary, "Profile updated successfully.")
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload or update a missionary's profile photo
 * @route   PATCH /api/missionaries/me/photo
 * @access  Private (Missionary)
 */
const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "No file was uploaded.");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    const oldPhotoPath = user.profilePhotoUrl;

    // The new path comes from the upload middleware
    const newPhotoPath = `/uploads/avatars/${req.file.filename}`;

    // Call the service, which we've now fixed to update the User model
    const updatedProfileResponse = await missionaryService.updateProfilePhoto(
      req.user,
      newPhotoPath
    );

    // After a successful DB update, delete the old photo file
    if (oldPhotoPath && oldPhotoPath !== newPhotoPath) {
      const fullPath = path.join(__dirname, "..", "public", oldPhotoPath);
      fs.unlink(fullPath, (err) => {
        if (err) console.error(`Failed to delete old photo: ${fullPath}`, err);
        else console.log(`Successfully deleted old photo: ${fullPath}`);
      });
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedProfileResponse,
          "Profile photo updated successfully."
        )
      );
  } catch (error) {
    // ... error handling ...
    next(error);
  }
};

/**
 * @desc    Delete a specific image from the missionary's page
 * @route   DELETE /api/missionaries/me/images
 * @access  Private (Missionary)
 */
const deletePageImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body; // We'll send the URL of the image to delete
    if (!imageUrl) {
      throw new ApiError(400, "Image URL is required.");
    }

    await missionaryService.deletePageImage(req.user, imageUrl);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Image deleted successfully."));
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all public, active missionaries with filtering
 * @route   GET /api/v1/missionaries/public
 * @access  Public
 */
const getPublicMissionaries = async (req, res, next) => {
  try {
    const { search, ministry, continent, page = 1, limit = 12 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build match stage
    const matchStage = {
      isActive: true,
    };

    if (search) {
      console.log("search",search)
      const searchRegex = new RegExp(search, "i");
      matchStage.$or = [
        { country: searchRegex },
        // If you store firstName/lastName on the missionary doc:
        { "userId.firstName": searchRegex },
        { "userId.lastName": searchRegex },
      ];
    }

    if (ministry) {
      matchStage.ministryType = ministry;
    }

    const pipeline = [
      // Step 1: Start with active missionaries
      { $match: { isActive: true } },

      // Step 2: Join with the 'users' collection to get the missionary's name
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } }, // Use preserve to keep missionaries even if user is deleted

      // Step 3: Join with the 'causes' collection to get all of this missionary's causes
      {
        $lookup: {
          from: "causes",
          localField: "_id", // The missionary's _id
          foreignField: "missionaryId", // The field on the Cause model
          as: "associatedCauses",
        },
      },
      // Step 4: Join with the 'users' collection again for base/location info
      {
        $lookup: {
          from: "users",
          localField: "baseId",
          foreignField: "_id",
          as: "baseUser",
        },
      },
      { $unwind: { path: "$baseUser", preserveNullAndEmptyArrays: true } },
    ];

    // Step 5: Build the main filtering logic ($match stage)
    const filterStage = {};

    // Handle search query across multiple fields
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filterStage.$or = [
        { "user.firstName": searchRegex },
        { "user.lastName": searchRegex },
        { country: searchRegex },
        { "associatedCauses.name": searchRegex }, // ✨ NEW: Search in cause titles
      ];
    }

    // Handle ministry type filter
    if (ministry) {
      filterStage.ministryType = ministry;
    }

    // Handle continent filter
    if (continent) {
      filterStage["baseUser.location"] = continent;
    }

    // Add the filter stage to the pipeline if it's not empty
    if (Object.keys(filterStage).length > 0) {
      pipeline.push({ $match: filterStage });
    }

    // Get total count for pagination *after* filtering
    const countPipeline = [...pipeline, { $count: "total" }];

    // Add projection and pagination to the main pipeline
    pipeline.push(
      {
        $project: {
          _id: 1,
          country: 1,
          ministryType: 1,
          bio: 1,
          images: 1,
          videoUrl: 1,
          userId: {
            _id: "$user._id",
            firstName: "$user.firstName",
            lastName: "$user.lastName",
            email: "$user.email",       
            isActive: "$user.isBlocked", 
            createdAt: "$user.createdAt",
            profilePhoto: "$user.profilePhotoUrl",
          },
          baseId: {
            _id: "$baseUser._id",
            location: "$baseUser.location",
          },
        },
      },
      { $skip: skip },
      { $limit: limitNum }
    );

    // Execute both pipelines concurrently
    const [missionaries, countResult] = await Promise.all([
      Missionary.aggregate(pipeline),
      Missionary.aggregate(countPipeline),
    ]);

    const totalMissionaries = countResult[0]?.total || 0;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          data: missionaries,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalMissionaries / limitNum),
            totalMissionaries,
          },
        },
        "Missionaries fetched successfully."
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Handle public missionary registration
 * @route   POST /api/v1/missionaries/public/signup
 * @access  Public
 */
const publicMissionarySignup = async (req, res, next) => {
  try {
    const signupData = req.body;
    // The service function now handles the registration logic
    const result = await missionaryService.registerPublicMissionary(signupData);

    // You might not want to send back the full user object on public signup
    // For security, just send a success message. The user can then log in.
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { userId: result.user._id },
          "Missionary registered successfully. Please log in."
        )
      );
  } catch (error) {
    next(error);
  }
};

const getMissionaryList = async (req, res, next) => {
    try {
        const missionaries = await Missionary.aggregate([
            // Step 1: Join with the 'users' collection (this part is the same)
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            // Step 2: Deconstruct the user array, but KEEP missionaries even if no user is found
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true // This is the key change
                }
            },
            // Step 3: Project the required fields, providing a fallback for the name
            {
                $project: {
                    _id: 1, // The Missionary's _id
                    name: {
                        // If user lookup fails, provide a default name
                        $ifNull: [
                            { $concat: ['$user.firstName', ' ', '$user.lastName'] },
                            'Unnamed Missionary' // A helpful fallback name
                        ]
                    }
                }
            },
            // Step 4: Sort alphabetically
            {
                $sort: { name: 1 }
            }
        ]);

        res.status(200).json(new ApiResponse(200, missionaries, "Missionaries fetched successfully"));
    } catch (error) {
        next(error);
    }
};
const assignBaseToMissionary = async (req, res, next) => {
  try {
    const { missionaryId } = req.params;
    const { baseId } = req.body;
    const npoAdmin = req.user;

    const updatedMissionary = await missionaryService.assignBase(
      missionaryId,
      baseId,
      npoAdmin
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedMissionary, "Base assigned successfully.")
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload multiple images for the missionary's page
 * @route   PATCH /api/missionaries/me/images
 * @access  Private (Missionary)
 */
const uploadPageImages = async (req, res, next) => {
  try {
    // The generic uploader provides the files in `req.files`
    if (!req.files || req.files.length === 0) {
      throw new ApiError(400, "No image files were uploaded.");
    }

    // Call a new service function to handle the database logic
    const updatedProfile = await missionaryService.addPageImages(
      req.user,
      req.files
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedProfile, "Images uploaded successfully.")
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload a verification document
 * @route   PATCH /api/missionaries/me/document
 * @access  Private (Missionary)
 */
const uploadVerificationDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "No document file was uploaded.");
    }
    const updatedProfile = await missionaryService.updateVerificationDocument(
      req.user,
      req.file
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedProfile, "Document uploaded successfully.")
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete the verification document
 * @route   DELETE /api/missionaries/me/document
 * @access  Private (Missionary)
 */
const deleteVerificationDocument = async (req, res, next) => {
  try {
    await missionaryService.deleteVerificationDocument(req.user);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Document deleted successfully."));
  } catch (error) {
    next(error);
  }
};
/**
 * @description Get a simplified list of active missionaries for donation forms.
 * @route GET /api/missionaries/list
 */
const listPublicMissionaries = async (req, res, next) => {
  try {
    const missionaries = await Missionary.find({ isActive: true })
      .populate('userId', 'firstName lastName') // Get the name from the linked User document
      .lean(); // Use .lean() for faster, plain JavaScript objects

    // Format the data into a clean array for the frontend
    const formattedMissionaries = missionaries.map(m => ({
      _id: m._id,
      // Combine the first and last name from the populated user document
      name: `${m.userId.firstName} ${m.userId.lastName}`.trim(),
    }));

    res.status(200).json(formattedMissionaries);
  } catch (error) {
    next(error); // Pass error to your error handling middleware
  }
};

module.exports = {
  addAndRegisterMissionary,
  getMissionariesForMyOrg,
  setMissionaryStatus,
  getMyProfile,
  updateMyProfile,
  uploadProfilePhoto,
  getPublicMissionaries,
  publicMissionarySignup,
  assignBaseToMissionary,
  uploadPageImages,
  deletePageImage,
  uploadVerificationDocument,
  deleteVerificationDocument,
  listPublicMissionaries,
  getMissionaryList
};

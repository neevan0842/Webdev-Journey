import { catchAsync, AppError } from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createUserAccount = catchAsync(async (req, res, _) => {
  const { name, email, password, role = "student" } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
  });

  await user.updateLastActive();
  generateToken(res, user, "User account created successfully");
});

export const authenticateUser = catchAsync(async (req, res, _) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  await user.updateLastActive();
  generateToken(res, user, "User authenticated successfully");
});

export const signOutUser = catchAsync(async (_, res) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 0,
    })
    .json({
      success: true,
      message: "User signed out successfully",
    });
});

export const getCurrentUserProfile = catchAsync(async (req, res, _) => {
  const user = await User.findById(req.id).populate({
    path: "enrolledCourses.course",
    select: "title thumbnail description",
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      ...user.toJSON(),
      totalEnrolledCourses: user.totalEnrolledCourses,
    },
  });
});

export const updateUserProfile = catchAsync(async (req, res, _) => {
  const { name, email, bio } = req.body;
  const updateData = {
    name,
    email: email?.toLowerCase(),
    bio,
  };

  if (req.file) {
    const avatarResult = await uploadMedia(req.file.path);
    updateData.avatar = avatarResult.secure_url;

    // delete old avatar from cloudinary if exists
    const user = await User.findById(req.id);
    if (user.avatar && user.avatar !== "default-avatar.png") {
      await deleteMediaFromCloudinary(user.avatar);
    }
  }

  // update user data
  const updatedUser = await User.findByIdAndUpdate(req.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  await updatedUser.updateLastActive();

  return res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    data: updatedUser,
  });
});

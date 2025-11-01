import { catchAsync, AppError } from "./error.middleware.js";

export const isAuthenticated = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new AppError("You are not authenticated", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decoded.userId;
    next();
  } catch (error) {
    throw new AppError("You are not authenticated", 401);
  }
});

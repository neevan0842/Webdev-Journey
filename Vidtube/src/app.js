import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middlewares.js";

const app = express();

//middleware
app.use(
  cors({
    origin: "*",
    credentials: true, // access-control-allow-credentials
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";

//use routers
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);

app.use(errorHandler);

export default app;

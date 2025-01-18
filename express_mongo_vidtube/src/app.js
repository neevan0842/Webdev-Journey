import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middlewares.js";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const morganFormat = ":method :url :status :response-time ms";

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
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

//import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";

//use routers
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);

app.use(errorHandler);

export default app;

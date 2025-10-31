import dotenv from "dotenv";
import express from "express";

dotenv.config();

console.log(process.env.PORT);

const app = express();
const PORT = process.env.PORT || 8000;

//Body Parser Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

//404 Route
app.use((req, res, next) => {
  res.status(404).json({
    status: "Error",
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT} in ${process.env.NODE_ENV} mode`);
});

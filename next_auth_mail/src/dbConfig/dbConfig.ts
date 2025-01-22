import mongoose from "mongoose";

export default async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    connection.on("error", (err) => {
      console.log("MongoDB connection error", err);
      process.exit(1);
    });
  } catch (error) {
    console.log("Something went wrong");
    console.log(error);
    process.exit(1);
  }
}

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // options can be provided if required
    });
    console.log("Auth DB connected");
  } catch (err) {
    console.error("Auth DB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;

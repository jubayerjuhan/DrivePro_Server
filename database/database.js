import mongoose from "mongoose";

export const connectToDatabase = () => {
  try {
    mongoose.connect(
      process.env.NODE_ENV === "production"
        ? process.env.DB_URI
        : process.env.LOCAL_DB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log(
          `Connected to database... ${process.env.NODE_ENV === "production"
            ? process.env.DB_URI
            : process.env.LOCAL_DB_URI
          }`
        );
      }
    );
  } catch (error) {
    console.error(`Can't Connect To Database...`);
  }
};

import mongoose from "mongoose";

type connnectionObject = {
  isConnected?: number;
};

const connnection: connnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connnection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MongoDB_URI || "");
    connnection.isConnected = db.connections[0].readyState;
    console.log("Connected to database");
  } catch (error) {
    console.error("Database connection failed :", error);
    process.exit(1);
  }
}

export default dbConnect;

import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("DB is Already Connected...");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI,{
        dbName: process.env.MONGODB_DBNAME,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    isConnected = true;
    console.log('DB Connected...');
    
  } catch (e) {
    console.log(e);
  }
};

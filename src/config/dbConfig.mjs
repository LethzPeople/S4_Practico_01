import mongoose from "mongoose";

export async function connectDB() {
  try {
    const url = process.env.MONGO_URI;
    await mongoose.connect(url);

    console.log("Conexión exitosa MongoDB");
  } catch (error) {
    console.error("Error al conectarse a MongoDB:", error.message);
    process.exit(1);
  }
}

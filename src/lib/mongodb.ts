import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// Declare a global type-safe cache
type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

// Access or create the global cache
const globalWithMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache;
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

export async function dbConnect(): Promise<Mongoose> {
  if (globalWithMongoose.mongoose!.conn) return globalWithMongoose.mongoose!.conn;
  if (!globalWithMongoose.mongoose!.promise) {
    globalWithMongoose.mongoose!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  globalWithMongoose.mongoose!.conn = await globalWithMongoose.mongoose!.promise;
  return globalWithMongoose.mongoose!.conn;
}

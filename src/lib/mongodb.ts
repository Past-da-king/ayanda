import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define a type for the global object to include our custom mongoose cache
// Using 'var' for global declaration merging
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache | undefined = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached!.conn) { // Non-null assertion: cached is initialized by this point
    return cached!.conn;
  }

  if (!cached!.promise) { // Non-null assertion: cached is initialized
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  
  try {
    cached!.conn = await cached!.promise; // Non-null assertion: cached is initialized
  } catch (e) {
    cached!.promise = null; // Reset promise on error to match MongooseCache type
    throw e;
  }
  
  if (!cached!.conn) { // Non-null assertion: cached is initialized
    throw new Error('MongoDB connection failed.');
  }
  return cached!.conn;
}

export default dbConnect;

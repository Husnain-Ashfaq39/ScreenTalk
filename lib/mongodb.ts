import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://user123:user123@clustor0.12up6.mongodb.net/?retryWrites=true&w=majority&appName=Clustor0';
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value is preserved across module reloads caused by HMR
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const dbName =  'ScreenTalk';
  const db = client.db(dbName);
  console.log('Connected to MongoDB database:', dbName); // Log connection success
  return { client, db };
} 
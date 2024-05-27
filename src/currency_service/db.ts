import { MongoClient, Db } from 'mongodb';

const uri = 'your_mongodb_connection_string';
const client = new MongoClient(uri);

let db: Db;

export const connectToDatabase = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db('your_database_name');
      console.log('Successfully connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB', error);
      process.exit(1);
    }
  }
  return db;
};

export const getDb = () => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};

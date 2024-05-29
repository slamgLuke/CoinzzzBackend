import { MongoClient, Db } from 'mongodb';

//create example uri with user and passwor
//const uri = 'mongodb://user:password@localhost:27017';
const uri = 'mongodb://root:coinzzz@44.198.144.9:27017/';
const client = new MongoClient(uri);

let db: Db;

export const connectToDatabase = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db('coinzzz_db');
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

import mongoose from 'mongoose';

class MongoDatabase {

  constructor() {
    this._connect();
  }

  async _connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDatabase successful');
    } catch (err) {
      console.log('MongoDatabase error: ', err);
    }
  }

  static getInstance() {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase(); 
    }
    return MongoDatabase.instance;
  }
}

export default MongoDatabase.getInstance();
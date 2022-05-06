import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.client = new MongoClient(`mongodb://${this.host}:${this.port}`, { useUnifiedTopology: true });
    this.client.connect();
    this.db = this.client.db(this.database);
  }

  isAlive() {
    if (this.client.isConnected()) return true;
    return false;
  }

  async nbUsers() {
    const userCount = this.users.countDocuments();
    return userCount;
  }

  async nbFiles() {
    const fileCount = this.files.countDocuments();
    return fileCount;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;

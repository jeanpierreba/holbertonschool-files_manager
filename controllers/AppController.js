import redisClient from "../utils/redis";
import dbClient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    const data = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.status(200).send(data);
  }

  static async getStats(req, res) {
    const data = {
      users: await dbClient.ndUsers(),
      files: await dbClient.nbFiles(),
    };
    res.status(200).send(data);
  }
}

export default AppController;

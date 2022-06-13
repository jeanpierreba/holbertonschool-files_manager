import RedisClient from "../utils/redis";
import DBClient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    if (redisClient.isAlive() && DBClient.isAlive()) {
		res.status(200).json({ redis: true, db: true}, 200)
	}
    return res.status(200).send(data);
  }

  static async getStats(req, res) {
    const data = {
      users: await DBClient.ndUsers(),
      files: await DBClient.nbFiles(),
    };
    return res.status(200).send(data);
  }
}

module.exports = AppController;

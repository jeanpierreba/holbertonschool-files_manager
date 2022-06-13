import RedisClient from "../utils/redis";
import DBClient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    if (redisClient.isAlive() && DBClient.isAlive()) {
		res.status(200).json({ redis: true, db: true}, 200);
	}
  }

  static async getStats(req, res) {
      const users = await DBClient.ndUsers();
	  const files = await DBClient.nbFiles();
    const data = {
		users,
		files,
    };
    res.status(200).send(data);
  }
}

module.exports = AppController;

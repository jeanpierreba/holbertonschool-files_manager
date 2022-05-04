import { v4 as uuidv4 } from 'uuid';

const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const crypto = require('crypto');

function hashPasswd(password) {
  const hash = crypto.createHash('sha1');
  const data = hash.update(password, 'utf-8');
  const genHash = data.digest('hex');
  return genHash;
}

class AuthController {
  static async getConnect(req, res) {
    const user = req.header('Authorization');
    if (!user || user.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const data = user.substring(6);
    const buff = Buffer.from(data, 'base64').toString('utf-8');
    const credentials = buff.split(':');
    if (!credential || credentials.length === 1) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const email = credentials[0].toString('utf-8');
    const passwd = credentials[1].toString('utf-8');
    const hashpwd = hashPasswd(passwd);
    const search = await dbClient.db.collection('users').find({ email, password: hashpwd }).toArray();
    if (search.length < 1) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
	if (hashpwd !== search[0].password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = uuidv4();
    const token = `auth_${key}`;
    await redisClient.set(token, search[0]._id.toString(), 86400);
    return res.status(200).json({ token: key });
  }

  static async getDisconnect(req, res) {
    const key = req.header('X-Token');
    if (!key || key.length === 0) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (await redisClient.get(`auth_${key}`)) {
      await redisClient.del(`auth_${key}`);
      return res.status(204).end();
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = AuthController;

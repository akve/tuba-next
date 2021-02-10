import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const imageUrl = process.env.IMAGE_URL || '';

const config = {
  environment: process.env.ENV || 'development',
  apiUrl: process.env.API_URL || 'https://devpp.purplepass.com/actions',
  port: process.env.PORT,
  staticFilesPath: path.join(__dirname, '../../static-content/'),
  uploadsPath: path.join(__dirname, '../../../../data/uploads'),
  imageUrl,
  logging: {
    dir: process.env.LOGGING_DIR || 'logs',
    level: process.env.LOGGING_LEVEL || 'debug',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
  },
  jwt_secret: 'SECRET',
};

export default config;

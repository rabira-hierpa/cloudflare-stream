import { connect } from 'mongoose';
import config from '../../config/defaults';
import { seedDB } from './seed';

const initDB = async () => {
  try {
    const mongoURI: string = config.mongoURI;
    await connect(mongoURI);
    await seedDB();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default initDB;

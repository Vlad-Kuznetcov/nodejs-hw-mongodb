import { initMongoConnection } from './bd/initMongoConnection.js';
import { setupServer } from './server.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { createDirIfNotExist } from './utils/createDirInNotExist.js';

const boostrap = async () => {
  await initMongoConnection();
  await createDirIfNotExist(TEMP_UPLOAD_DIR);
  await createDirIfNotExist(UPLOAD_DIR);
  setupServer();
};

boostrap();

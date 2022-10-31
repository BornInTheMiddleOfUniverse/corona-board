import path from 'path';
import fs from 'fs';
import ApiClient from './api-client';
import crawlAndUpdateDomestic from './domestic-updater';
import crawlAndUpdateGlobal from './global-updater';

const main = async () => {
  const outputPath = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  const apiClient = new ApiClient();

  try {
    console.log('crawlAndUpdateDomestic started');
    await crawlAndUpdateDomestic(outputPath, apiClient);
  } catch (e) {
    console.error('crawlAndUpdateDomestic failed', e);
  }
  
  try {
    console.log('crawlAndUpdateGlobal started');
    await crawlAndUpdateGlobal(outputPath, apiClient);
  } catch (e) {
    console.error('crawlAndUpdateGlobal failed', e);
  }
}

main();

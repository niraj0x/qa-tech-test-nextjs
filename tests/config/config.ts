import path from "path";
import fs from 'fs';

const env = process.env.ENV || 'sint';
const configPath = path.resolve(__dirname, `${env}/config.json`);

if (fs.existsSync(configPath)) {
  console.log(`Loading configuration for environment: ${env} from ${configPath}`)
}
else {
  throw new Error(`Failing to load configuration for environment: ${env} — file not found: ${configPath}`)
}

const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

export const envConfig = {
  ...configData,
  env
}

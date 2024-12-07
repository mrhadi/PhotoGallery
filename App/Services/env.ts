import Config from 'react-native-config';
import dotenvParseVariables from 'dotenv-parse-variables';

const ENV = {
  BASE_API_URL: Config.BASE_API_URL,
  API_KEY: Config.API_KEY,
};

dotenvParseVariables(ENV);

export default ENV;

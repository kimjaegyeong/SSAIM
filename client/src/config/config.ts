// src/config.ts

interface Config {
  BASE_URL: string;
}

const devConfig: Config = {
  BASE_URL: 'https://dev.api.example.com',
};

const prodConfig: Config = {
  BASE_URL: 'https://api.example.com',
};

const config: Config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;

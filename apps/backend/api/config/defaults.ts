const config = {
  mongoURI:
    process.env.MONGO_DB_URI || 'mongodb://localhost:2701/cloudflare-stream',
  sessionSecret: 'rzcodes-secret',
  adminClient: 'http://localhost:15000',
};

export default config;

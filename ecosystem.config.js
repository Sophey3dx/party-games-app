module.exports = {
  apps: [
    {
      name: 'party-games-backend',
      script: './backend/server.js',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log'
    }
  ]
};

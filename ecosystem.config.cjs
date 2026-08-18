module.exports = {
  apps: [
    {
      name: 'precinct-server',
      cwd: './server',
      script: 'start.cjs',
      interpreter: 'node',
      watch: false,
      autorestart: true,
      max_restarts: 10,
    },
  ],
};

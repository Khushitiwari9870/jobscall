module.exports = {
  apps: [{
    name: 'jobscall-frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3110',
    cwd: '/var/www/jobscall/khushijobscall/khushi/jobscall_frontend',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3110
    }
  }]
};

module.exports = {
  apps: [
    {
      name: "Feedr",
      script: "bin/www",
      instances: 3,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],

  deploy: {
    production: {
      user: "node",
      host: "http://feedrapp.info/",
      ref: "origin/master",
      repo: "git@github.com:sdepold/feedrapp.git",
      path: "/var/www/production",
      "post-deploy": "yarn && pm2 reload ecosystem.config.js --env production"
    }
  }
};

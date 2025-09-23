const path = require('path');

module.exports = {
  // Domain and URLs
  SITE_DOMAIN: 'iurii.net',

  get SITE_URL() {
    return `https://${this.SITE_DOMAIN}`;
  },

  get LINKED_IN() {
    return 'https://www.linkedin.com/in/iuriik/';
  },

  get GIT_HUB() {
    return 'https://github.com/aka-rider';
  },

  // Paths
  ROOT_DIR: process.cwd(),
  BLOG_POSTS_DIR: '_posts',

  // Environment
  get DEBUG() {
    return process.env.NODE_ENV === 'development';
  },
  get IS_PRODUCTION() {
    return process.env.NODE_ENV === 'production';
  },
};

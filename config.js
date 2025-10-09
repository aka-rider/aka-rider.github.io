const path = require('path');

module.exports = {

  get CNAME() {
    return "iurii.net";
  },

  get SITE_URL() {
    return `https://${this.CNAME}`;
  },

  get LINKED_IN() {
    return 'https://www.linkedin.com/in/iuriik/';
  },

  get GIT_HUB() {
    return 'https://github.com/aka-rider';
  },

  // Paths
  get ROOT_DIR() {
    return process.cwd();
  },

  get BLOG_POSTS_DIR() {
    return '_posts';
  },

  // Environment
  get DEBUG() {
    return process.env.NODE_ENV === 'development';
  },
  get IS_PRODUCTION() {
    return process.env.NODE_ENV === 'production';
  },
};

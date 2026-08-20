module.exports = {
  get CNAME() {
    return 'iurii.net';
  },

  get SITE_URL() {
    if (process.env.NODE_ENV === 'development') {
      const port = process.env.PORT || 3000;
      return `http://localhost:${port}`;
    }
    return `https://${this.CNAME}`;
  },

  get LINKED_IN() {
    return 'https://www.linkedin.com/in/iuriik/';
  },

  get GIT_HUB() {
    return 'https://github.com/aka-rider';
  },

  get GISCUS() {
    return {
      repo: 'aka-rider/aka-rider.github.io',
      repoId: 'MDEwOlJlcG9zaXRvcnkyNjc3MDM0MTc=',
      category: 'General',
      categoryId: 'DIC_kwDOD_TUec4CO4sM',
    };
  },

  get DEFAULT_POST_IMAGE() {
    return '/images/blog-generic.webp';
  },

  get ROOT_DIR() {
    return process.cwd();
  },

  get BLOG_POSTS_DIR() {
    return '_posts';
  },

  get DEBUG() {
    return process.env.NODE_ENV === 'development';
  },
  get IS_PRODUCTION() {
    return process.env.NODE_ENV === 'production';
  },
};

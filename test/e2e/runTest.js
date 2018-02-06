let url = 'http://localhost:3001';

module.exports = {
  before(browser) {
    url = browser.launch_url;
  },
  'Example run'(browser) {
    browser
      .url(url)
      .end();
  },
};

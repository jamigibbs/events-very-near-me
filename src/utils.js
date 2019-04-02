  /**
   * Replacing localhost:3000 with the eventful domain name when we're 
   * working in development environment.
   * 
   * @param {string} url 
   */
  function cleanEventfulURL(url) {
    const path = url.split('3000')[1]
    return path ? `https://eventful.com${path}` : url
  }

  module.exports = {
    cleanEventfulURL
  }
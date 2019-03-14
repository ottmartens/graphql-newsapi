const axios = require('axios');

const { apiKey } = require('./config');

module.exports = db => {
  const basePath = 'https://newsapi.org/v2/top-headlines?language=en&pageSize=100&apiKey=' + apiKey;

  const categories = ['business', 'technology', 'sports', 'all'];

  const clearData = () => {
    categories.forEach(c => {
      db.collection(c).deleteMany({});
    });
  };

  const fetchArticles = category => {
    axios
      .get(`${basePath}${category != 'all' ? '&category=' + category + '&country=us' : ''}`)
      .then(res => res.data.articles)
      .then(articles => {
        const filtered = articles.filter(
          a => (a.description || a.content) && a.source && a.source.id != 'the-jerusalem-post',
        );
        db.collection(category).insertMany(filtered);
      })
      .catch(error => {
        console.log('Error fetching new articles');
      });
  };

  const flushAndFetch = () => {
    clearData();

    categories.forEach(async c => {
      fetchArticles(c);
    });
  };

  console.log('Fetching articles..');

  flushAndFetch();

  setInterval(() => flushAndFetch(), 1000 * 60 * 15);
};

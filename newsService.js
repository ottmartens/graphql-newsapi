
const axios = require('axios');

const { apiKey } = require('./config');

const basePath = 'https://newsapi.org/v2/top-headlines?language=en&apiKey=' + apiKey;
const localPath = 'http://localhost:3000';

const categories = [
  'business',
  'technology',
  'sports',
  null
]

const clearData = (category) => {
  axios.put(`${localPath}/${category ? category : 'all'}`, {})
  .catch(error => {
    console.log(error)
  })
}

const fetchArticles = (category) => {
  axios.get(`${basePath}${category ? '&category='+category+ '&country=us' : '&pageSize=50'}`)
  .then(res => res.data.articles)
  .then(articles => {
    const filtered = articles.filter(a => !!a.source ? a.source.id != 'the-jerusalem-post' : true)
    return axios.post(`${localPath}/${category ? category : 'all'}`, filtered)
  })
  .catch(error => {
    console.log(error)
  })
}

const flushAndFetch = () => {
  categories.forEach(async c => {
    await clearData(c)
    fetchArticles(c)
  })
}


module.exports = { flushAndFetch, clearData, fetchArticles}
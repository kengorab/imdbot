const { promisify } = require('util')
const imdbApi = require('imdb')
const omdbApi = require('omdb-client')

const omdbSearch = promisify(omdbApi.search)
const imdbSearch = promisify(imdbApi)

module.exports.search = async function search(query) {
  const params = {
    apiKey: process.env.OMDB_API_KEY,
    query
  }

  try {
    const { Search: search } = await omdbSearch(params)
    if (search.length === 0) {
      return null
    }

    const { imdbID } = search[0]
    const response = await imdbSearch(imdbID)

    return { ...response, id: imdbID }
  } catch (e) {
    console.error(`${e}: ${query}`)
    return null
  }
}

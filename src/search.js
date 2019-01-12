const { promisify } = require('util')
const imdbApi = require('imdb')
const omdbApi = require('omdb-client')

const omdbSearch = promisify(omdbApi.search)
const imdbSearch = promisify(imdbApi)
const apiKey = process.env.OMDB_API_KEY

module.exports.search = search

async function search(query) {
  try {
    const { Search: search } = await omdbSearch({ apiKey, query })
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

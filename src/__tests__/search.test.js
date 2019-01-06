const { search } = require('../search')

const apiKey = 'xicuvghqkljwehgriufdsvhjk'
const imdbSearch = jest.fn()
const omdbSearch = jest.fn()

describe('search', () => {
  beforeEach(() => {
    imdbSearch.mockReset()
    omdbSearch.mockReset()
  })

  it('it returns null if omdb search has no results', async () => {
    omdbSearch.mockResolvedValue({ Search: [] })

    let query = 'query with no results'
    const result = await search(query, apiKey, omdbSearch, imdbSearch)
    expect(result).toBe(null)

    expect(omdbSearch).toHaveBeenCalledWith({ apiKey, query })
  })

  it('it queries imdb for id from omdb response', async () => {
    const omdbResult = { imdbID: 'tt9uwegfhdjkv', other: 'stuff', goes: 'here' }
    omdbSearch.mockResolvedValue({ Search: [omdbResult] })

    const imdbResult = {
      title: 'Title',
      year: '2009',
      contentRating: 'N/A',
      runtime: '2h 45m',
      description: 'Description',
      genre: ['Comedy'],
      rating: '6.2',
      metascore: '60',
      poster: 'https://poster.url/img.png'
    }
    imdbSearch.mockResolvedValue(imdbResult)

    let query = 'query with results'
    const result = await search(query, apiKey, omdbSearch, imdbSearch)
    expect(result).toEqual({ ...imdbResult, id: omdbResult.imdbID })

    expect(omdbSearch).toHaveBeenCalledWith({ apiKey, query })
    expect(imdbSearch).toHaveBeenCalledWith(omdbResult.imdbID)
  })

  it('it returns null if omdb request fails', async () => {
    omdbSearch.mockRejectedValue('No Movie Found!')

    let query = 'query with results'
    const result = await search(query, apiKey, omdbSearch, imdbSearch)
    expect(result).toBe(null)
  })

  it('it returns null if imdb request fails', async () => {
    const omdbResult = { imdbID: 'tt9uwegfhdjkv', other: 'stuff', goes: 'here' }
    omdbSearch.mockResolvedValue({ Search: [omdbResult] })

    imdbSearch.mockRejectedValue('Some error')

    let query = 'query with results'
    const result = await search(query, apiKey, omdbSearch, imdbSearch)
    expect(result).toBe(null)
  })
})

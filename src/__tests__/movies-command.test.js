const { handler: moviesCommand } = require('../movies-command')

const search = jest.fn()

describe('movies-command', () => {
  it('should return an error message if no movie found', async () => {
    const event = {
      body: 'team_id=ryue894uf&other_stuff=whatever&text=finding%20nemo'
    }
    search.mockResolvedValue(null)

    const response = await moviesCommand(event, search)
    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        response_type: 'in_channel',
        text: `Couldn't find a movie called "finding nemo" :shrug:`
      })
    })

    expect(search).toHaveBeenCalledWith('finding nemo')
  })

  it('should return the response if movie found', async () => {
    const event = {
      body: 'team_id=ryue894uf&other_stuff=whatever&text=finding%20nemo'
    }
    const movie = {
      id: 'tt0266543',
      title: 'Finding Nemo',
      year: '2003',
      contentRating: 'N/A',
      runtime: '1h 40min',
      description: 'After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.',
      genre: ['Animation', 'Adventure', 'Comedy'],
      rating: '8.1',
      metascore: '90',
      poster: 'https://some.poster.com/img.png'
    }
    search.mockResolvedValue(movie)

    const response = await moviesCommand(event, search)

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        response_type: 'in_channel',
        text: `*Finding Nemo*
${movie.description}
*Genres*: Animation,Adventure,Comedy
*Year*: 2003 *Rated*: N/A *Runtime*: 1h 40min
*Rating*: 8.1 *Metascore*: 90
*IMDb Link*: https://www.imdb.com/title/tt0266543
Not what you intended? See all results: https://www.imdb.com/find?q=finding%20nemo#tt`,
        attachments: [
          { image_url: movie.poster }
        ]
      })
    })

    expect(search).toHaveBeenCalledWith('finding nemo')
  })
})

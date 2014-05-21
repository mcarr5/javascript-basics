using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductStore.Models
{
    public class MovieRepository : IMovieRepository
    {
        List<Movie> movies = new List<Movie>();

        public MovieRepository()
        {
            // Construct with some sample static data
            Add(new Movie() { Title = "Flight", Duration = "1:30", Genre = "Drama", Rating = 4 });
            Add(new Movie() { Title = "Captain Phillips", Duration = "1:39", Genre = "Drama", Rating = 3 });
            Add(new Movie() { Title = "Oz the Great and Powerful", Duration = "1:23", Genre = "Drama", Rating = 4 });
            Add(new Movie() { Title = "Blackfish", Duration = "1:37", Genre = "Drama", Rating = 3 });
            Add(new Movie() { Title = "12 Years a Slave", Duration = "1:45", Genre = "Drama", Rating = 5 });
            Add(new Movie() { Title = "Dallas Buyers Club", Duration = "1:49", Genre = "Drama", Rating = 5 });
        }

        public IEnumerable<Movie> GetAll()
        {
            return movies;
        }

        public Movie Get(int id)
        {
            return movies.Find(_ => _.Id == id);
        }

        public Movie Add(Movie movie)
        {
            if (movie == null)
            {
                throw new ArgumentNullException("movie");
            }

            movie.Id = movies.Count + 1;
            movies.Add(movie);
            return movie;
        }

        public void Remove(int id)
        {
            movies.RemoveAll(_ => _.Id == id);
        }

        public bool Update(Movie movie)
        {
            if (movie == null)
            {
                throw new ArgumentNullException("movie");
            }
            int index = movies.FindIndex(_ => _.Id == movie.Id);
            if (index == -1)
            {
                return false;
            }
            movies[index] = movie;
            return true;
        }
    }
}
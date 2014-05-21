using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using System.Web;
using ProductStore.Models;

namespace ProductStore.Controllers
{
    public class MoviesApiController : ApiController
    {
        static readonly IMovieRepository repository = new MovieRepository();

        // GET api/movies
        public IEnumerable<Movie> GetAllMovies()
        {
            //Read
            return repository.GetAll();
        }

        // GET api/movies/5
        public Movie GetMovie(int id)
        {
            // Read
            Movie movie = repository.Get(id);
            if (movie == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return movie;
        }

        public IEnumerable<Movie> GetMoviesByTitle(string title)
        {
            return repository.GetAll().Where(_ => string.Equals(_.Title, title, StringComparison.OrdinalIgnoreCase));
        }

        public IEnumerable<Movie> GetMoviesByGenre(string genre)
        {
            return repository.GetAll().Where(_ => string.Equals(_.Genre, genre, StringComparison.OrdinalIgnoreCase));
        }

        // POST api/movies
        public HttpResponseMessage PostMovie(Movie value)
        {
            // Create
            value = repository.Add(value);
            HttpResponseMessage response = Request.CreateResponse<Movie>(HttpStatusCode.Created, value);

            string url = Url.Link("DefaultApi", new { id = value.Id });
            response.Headers.Location = new Uri(url);
            return response;
        }

        // PUT api/movies/5
        public void PutMovie(int id, Movie value)
        {
            // Update
            value.Id = id;
            if (!repository.Update(value))
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }            
        }

        // DELETE api/movies/5
        public void DeleteMovie(int id)
        {
            // Delete
            repository.Remove(id);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductStore.Models
{
    interface IMovieRepository
    {
        IEnumerable<Movie> GetAll();
        Movie Get(int id);
        Movie Add(Movie item);
        void Remove(int id);
        bool Update(Movie item);
    }
}
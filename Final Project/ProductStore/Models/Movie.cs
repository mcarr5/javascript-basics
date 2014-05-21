using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductStore.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Genre { get; set; }
        public string Duration { get; set; }
        public int? Rating { get; set; }
        public string PosterUrl { get; set; }
    }
}
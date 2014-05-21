using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ProductStore.Controllers
{
    public class HomeViewController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}

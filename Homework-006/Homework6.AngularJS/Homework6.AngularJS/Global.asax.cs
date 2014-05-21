// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Global.asax.cs" company="Magenic">
//   Copyright © 2014 Magenic
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace Homework6.AngularJS
{
    using System.Web;
    using System.Web.Optimization;
    using System.Web.Routing;

    public class Application : HttpApplication
    {
        protected void Application_Start()
        {
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}

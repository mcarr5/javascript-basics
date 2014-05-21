// --------------------------------------------------------------------------------------------------------------------
// <copyright file="RouteConfig.cs" company="Magenic">
//   Copyright © 2014 Magenic
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace Homework6.AngularJS
{
    using System.Web.Routing;

    using Homework6.AngularJS.Routing;

    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.Add("Default", new DefaultRoute());
        }
    }
}

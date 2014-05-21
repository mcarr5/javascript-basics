// --------------------------------------------------------------------------------------------------------------------
// <copyright file="DefaultRoute.cs" company="Magenic">
//   Copyright © 2014 Magenic
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace Homework6.AngularJS.Routing
{
    using System.Web.Routing;

    public class DefaultRoute : Route
    {
        public DefaultRoute()
            : base("{*path}", new DefaultRouteHandler())
        {
            this.RouteExistingFiles = false;
        }
    }
}

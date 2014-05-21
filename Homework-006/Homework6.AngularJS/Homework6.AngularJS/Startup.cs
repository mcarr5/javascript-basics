// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Startup.cs" company="Magenic">
//   Copyright © 2014 Magenic
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

[assembly: Microsoft.Owin.OwinStartup(typeof(Homework6.AngularJS.Startup))]

namespace Homework6.AngularJS
{
    using Owin;

    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //// For more information on how to configure your application, visit:
            //// http://go.microsoft.com/fwlink/?LinkID=316888

            this.ConfigureAuth(app);
        }
    }
}

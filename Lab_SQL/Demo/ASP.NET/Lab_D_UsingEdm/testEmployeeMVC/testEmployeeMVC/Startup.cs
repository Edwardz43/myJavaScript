using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(testEmployeeMVC.Startup))]
namespace testEmployeeMVC
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

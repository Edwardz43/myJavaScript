using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace testEmployeeMVC.Controllers {
    public class HomeController : Controller {
        public ActionResult Index() {
            DataSet ds = GetData();
            return View(ds);
        }

        // TODO: GetData move into DBService Class
        private static DataSet GetData() {
            SqlConnection cn = new SqlConnection("server=(local)\\SQLExpress; database=directory; integrated security=true");
            cn.Open();
            SqlDataAdapter da = new SqlDataAdapter("select * from employee", cn);
            DataSet ds = new DataSet();
            da.Fill(ds, "emp");
            return ds;
        }


        public ActionResult About() {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact() {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}
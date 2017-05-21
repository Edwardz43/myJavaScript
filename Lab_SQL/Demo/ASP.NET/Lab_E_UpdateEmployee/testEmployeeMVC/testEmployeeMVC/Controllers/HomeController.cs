using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Data.SqlClient;
using testEmployeeMVC.Models;
using testEmployeeMVC.Models.DirectoryDataSetTableAdapters;

namespace testEmployeeMVC.Controllers {
    public class HomeController : Controller {
        public ActionResult Index() {
            directoryEntities db = new directoryEntities();  // DBContext
            // List<employee> empList =  db.employee.ToList<employee>();
            
            var query = from o in db.employee
                        where o.id >= 0
                        select o;
            List<employee> empList = query.ToList<employee>();

            return View("EdmIndex", empList);
        }

        //public ActionResult Index() {
        //    DirectoryDataSet ds = new DirectoryDataSet();
        //    employeeTableAdapter da = new employeeTableAdapter();
        //    da.Fill(ds.employee);

        //    return View("AdoNetIndex", ds.employee);
        //}

        // TODO: GetData move into DBService Class
        private static DataSet GetData() {
            SqlConnection cn = new SqlConnection("server=(local)\\SQLExpress; database=directory; integrated security=true");
            cn.Open();
            SqlDataAdapter da = new SqlDataAdapter("select * from employee", cn);
            DataSet ds = new DataSet();
            da.Fill(ds, "emp");
            return ds;
        }

        public ActionResult Update(int id) {
            directoryEntities db = new directoryEntities();  // DBContext
            employee emp = db.employee.Find(id);
            return View(emp);
        }

        [HttpPost]
        public ActionResult Update(employee empForm) {
            directoryEntities db = new directoryEntities();  // DBContext
            employee emp = db.employee.Find(empForm.id);
            emp.firstName = empForm.firstName;
            emp.lastName = empForm.lastName;
            emp.email = empForm.email;

            db.SaveChanges();
            return RedirectToAction("index");
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
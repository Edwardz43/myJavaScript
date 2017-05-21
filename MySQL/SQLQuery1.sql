/* 010 
  確定打開的是 Northwind 資料庫 */
use Northwind
go

/* 110 
  請寫一道指令, 列出:
  products 資料表的所有產品資料
 */ 



/* 120 
  請寫一道指令. 列出:
  products 資料表的所有產品, 條列資料時, 請列出以下欄位:
  ProductID, ProductName, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel
 */ 



/* 130 
  請寫一道指令, 列出:
  products 資料表 "庫存量低於再訂購量" 的產品資料, 條列資料時, 
  請列出以下欄位:
  ProductID, ProductName, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel
 */ 



/* 140 
  請寫一道指令, 列出:
  products 資料表 (庫存量 + 訂購中數量) 低於再訂購量的產品資料, 條列資料時, 
  請列出以下欄位:
  ProductID, ProductName, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel
 */ 





/* 150 
  請寫一道指令, 列出:
  products 資料表 "庫存量低於再訂購量" 的產品資料, 條列資料時, 
  請列出以下欄位
  SupplierID, ProductID, ProductName, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel

  並且, 相同供應商代號(SupplierID)的產品請排在一起
 */ 





/* 160 
  請寫一道 指令 列出:
  products table 產品名稱以 C 開頭的資料
 */ 




/* 170 
  請寫一道指令, 列出:
  products 資料表之類別編號(CategoryID)為 1, 4, 8 的產品資料
  排序時, 請按"類別編號"排序, 相同類別編號的產品按產品名稱(ProductName)排列
 */ 





/* 180 
  請寫一道指令, 列出:
  products 資料表之單價介於 10 到 20 元之間(包含 10, 20)的產品資料
  並且按照單價(UnitPrice)由大到小排序
 */ 





/* 190 
  請寫一道指令, 列出:
  products 資料表之所有產品, 條列資料時, 
  請列出以下欄位
  ProductID, ProductName, UnitPrice, 

  不過, 各欄位名稱請用中文顯示:
  產品編號, 產品名稱, 單價
 */ 






-- 210 請列出單價最高的前三項產品。





-- 220 請列出產品的平均單價。




-- 230 請以類別編號(CategoryID)等於 1, 4, 8 為計算範圍, 計算產品的平均單價。
select avg(UnitPrice)
	from Products
	where CategoryID in (1,4,8)



-- 240 請列出各類產品的平均單價。
select avg(UnitPrice) as AvgPrice,CategoryID
	from Products
	group by CategoryID



-- 250 請列出平均單價最高的前三類產品。
select top 3 avg(UnitPrice) as AvgPrice,CategoryID
	from Products
	group by CategoryID



/* 310
  請寫一道指令, 列出 products 資料表的以下欄位
  ProductID, ProductName, SupplierID
 */ 
 select ProductID, ProductName, SupplierID
	from Products

select count(reportsto)
	from Employees
------------------------2017/05/20----------------------------
select CategoryID, AVG(Unitprice) as AvgPrice
	from Products
	where ProductID >=0
	group by CategoryID having AVG(Unitprice) > 30

select CategoryID, AVG(Unitprice) as AvgPrice
	--into #Temp1
	from Products
	where ProductID >=0
	group by CategoryID



/* 320
   同上, 但請一併列出該供應商名稱(CompanyName)、
   聯絡電話(Phone)、聯絡人(ContactName)好嗎?
   另外, 相同供應商的資料請列在一起
 */ 
 select ProductID, ProductName as PN , p.SupplierID ,CompanyName as CN, Phone, ContactName
	from Products as p join Suppliers as s
	on s.SupplierID = p.SupplierID
	order by ProductID

create view vTest as
	select ProductID, ProductName as PN , p.SupplierID ,CompanyName as CN, Phone, ContactName
		from Products as p join Suppliers as s
		on s.SupplierID = p.SupplierID

select * from vTest

drop view vTest 

 select ProductID, ProductName as PN , p.SupplierID ,CompanyName as CN, Phone, ContactName
	from Products as p join Suppliers as s
	on s.SupplierID = p.SupplierID
	order by ProductID


select ProductID, ProductName as PN , p.SupplierID ,CompanyName as CN, Phone, ContactName
	from  Suppliers as s left join Products as p
	on s.SupplierID = p.SupplierID
	order by ProductID

select * from EmployeeTerritories 
select * from Employees





/* 330
   我想列出「所有」供應商目前各自提供我們哪些產品資料的對照表,
   目前沒提供我們產品的供應商也要列出

   <note>
   下指令前, 請先執行下列指令:
   -- begin --
   insert into suppliers
     (CompanyName, ContactName, Phone)
      values
     ('Taiwan First', 'A-Ban', '(001) 000-0001')
   -- end --
 */ 
 select * from Products



-- (Optional)
-- 340 請列出員工及其員工直屬老闆（ReportsTo）的清單。
select * from Employees
-------

create view EmployeeTable as
select a.EmployeeID, (a.LastName + ' '+ a.FirstName) as EmployeeName ,
		(b.FirstName + ' ' + b.LastName) as ReportsTo
	from Employees as a join Employees as b on a.ReportsTo = b.EmployeeID



select * from EmployeeTable

drop view EmployeeTable 

/* 410
  請列出各項產品的類別、編號、品名、單價、
  該類產品平均單價、單價與產品平均單價的「價差」。
*/
select * from Products
-------
select ProductID, CategoryID, ProductName, UnitPrice 
	from Products
-------
select avg(UnitPrice) from Products
-------
select ProductID, CategoryID, ProductName, UnitPrice,
	(select avg(UnitPrice) from Products) as AvgPrice
	from Products
------
select ProductID, CategoryID, ProductName, UnitPrice,
	(select avg(UnitPrice) from Products) as AvgPrice,
	UnitPrice - (select avg(UnitPrice) from Products) as PriceDiff
	from Products
	order by UnitPrice - (select avg(UnitPrice) from Products) desc
---(1)---
select ProductID, CategoryID, ProductName, UnitPrice,
	(select avg(UnitPrice) from Products where CategoryID = p.CategoryID) as AvgPrice,
	UnitPrice - (select avg(UnitPrice) from Products ) as PriceDiff
	from Products as p
	order by UnitPrice - (select avg(UnitPrice) from Products) desc

---(2)---

select CategoryID ,avg(UnitPrice)
	from Products
	group by CategoryID
---------
select p.CategoryID, ProductID,  ProductName,UnitPrice,  AvgPrice 
	from Products as p join 
	(
		select CategoryID ,avg(UnitPrice) as AvgPrice
			from Products
			group by CategoryID
	) as T on T.CategoryID = p.CategoryID



/* 420
   請列出有訂第三類產品的訂單。
*/

create view Category3 as
	select * 
		from Orders
		where OrderID in
			(
				select OrderID from [Order Details]
				where ProductID in
					(
						select ProductID 
							from Products
							where CategoryID = 3
					)
			)

select * from Category3
drop view Category3
------
/*
請列出有美商供應的產品。
*/
select * from Products
	where SupplierID in 
	(
		select SupplierID from Suppliers
			where Country = 'USA'
	)



/* 430
  請列出賣得最好前三項產品。
*/


create view Top3Price as 
	select  top 99999999 * 
		from Products as p
		where ProductName in 
		(
			select top 3 ProductName from Products 
				 where CategoryID = p.CategoryID
				 order by UnitPrice desc
		)
		order by CategoryID, UnitPrice desc


select * from Top3Price
drop view Top3Price
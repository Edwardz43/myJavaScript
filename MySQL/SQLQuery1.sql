/* 010 
  �T�w���}���O Northwind ��Ʈw */
use Northwind
go

/* 110 
  �мg�@�D���O, �C�X:
  products ��ƪ��Ҧ����~���
 */ 



/* 120 
  �мg�@�D���O. �C�X:
  products ��ƪ��Ҧ����~, ���C��Ʈ�, �ЦC�X�H�U���:
  ProductID, ProductName, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel
 */ 



/* 130 
  �мg�@�D���O, �C�X:
  products ��ƪ� "�w�s�q�C��A�q�ʶq" �����~���, ���C��Ʈ�, 
  �ЦC�X�H�U���:
  ProductID, ProductName, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel
 */ 



/* 140 
  �мg�@�D���O, �C�X:
  products ��ƪ� (�w�s�q + �q�ʤ��ƶq) �C��A�q�ʶq�����~���, ���C��Ʈ�, 
  �ЦC�X�H�U���:
  ProductID, ProductName, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel
 */ 





/* 150 
  �мg�@�D���O, �C�X:
  products ��ƪ� "�w�s�q�C��A�q�ʶq" �����~���, ���C��Ʈ�, 
  �ЦC�X�H�U���
  SupplierID, ProductID, ProductName, UnitPrice, UnitsInStock, UnitsOnOrder, ReorderLevel

  �åB, �ۦP�����ӥN��(SupplierID)�����~�бƦb�@�_
 */ 





/* 160 
  �мg�@�D ���O �C�X:
  products table ���~�W�٥H C �}�Y�����
 */ 




/* 170 
  �мg�@�D���O, �C�X:
  products ��ƪ����O�s��(CategoryID)�� 1, 4, 8 �����~���
  �ƧǮ�, �Ы�"���O�s��"�Ƨ�, �ۦP���O�s�������~�����~�W��(ProductName)�ƦC
 */ 





/* 180 
  �мg�@�D���O, �C�X:
  products ��ƪ�������� 10 �� 20 ������(�]�t 10, 20)�����~���
  �åB���ӳ��(UnitPrice)�Ѥj��p�Ƨ�
 */ 





/* 190 
  �мg�@�D���O, �C�X:
  products ��ƪ��Ҧ����~, ���C��Ʈ�, 
  �ЦC�X�H�U���
  ProductID, ProductName, UnitPrice, 

  ���L, �U���W�ٽХΤ������:
  ���~�s��, ���~�W��, ���
 */ 






-- 210 �ЦC�X����̰����e�T�����~�C





-- 220 �ЦC�X���~����������C




-- 230 �ХH���O�s��(CategoryID)���� 1, 4, 8 ���p��d��, �p�ⲣ�~����������C
select avg(UnitPrice)
	from Products
	where CategoryID in (1,4,8)



-- 240 �ЦC�X�U�����~����������C
select avg(UnitPrice) as AvgPrice,CategoryID
	from Products
	group by CategoryID



-- 250 �ЦC�X��������̰����e�T�����~�C
select top 3 avg(UnitPrice) as AvgPrice,CategoryID
	from Products
	group by CategoryID



/* 310
  �мg�@�D���O, �C�X products ��ƪ��H�U���
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
   �P�W, ���Ф@�֦C�X�Ө����ӦW��(CompanyName)�B
   �p���q��(Phone)�B�p���H(ContactName)�n��?
   �t�~, �ۦP�����Ӫ���ƽЦC�b�@�_
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
   �ڷQ�C�X�u�Ҧ��v�����ӥثe�U�۴��ѧڭ̭��ǲ��~��ƪ���Ӫ�,
   �ثe�S���ѧڭ̲��~�������Ӥ]�n�C�X

   <note>
   �U���O�e, �Х�����U�C���O:
   -- begin --
   insert into suppliers
     (CompanyName, ContactName, Phone)
      values
     ('Taiwan First', 'A-Ban', '(001) 000-0001')
   -- end --
 */ 
 select * from Products



-- (Optional)
-- 340 �ЦC�X���u�Ψ���u���ݦ���]ReportsTo�^���M��C
select * from Employees
-------

create view EmployeeTable as
select a.EmployeeID, (a.LastName + ' '+ a.FirstName) as EmployeeName ,
		(b.FirstName + ' ' + b.LastName) as ReportsTo
	from Employees as a join Employees as b on a.ReportsTo = b.EmployeeID



select * from EmployeeTable

drop view EmployeeTable 

/* 410
  �ЦC�X�U�����~�����O�B�s���B�~�W�B����B
  �������~��������B����P���~����������u���t�v�C
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
   �ЦC�X���q�ĤT�����~���q��C
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
�ЦC�X�����Ө��������~�C
*/
select * from Products
	where SupplierID in 
	(
		select SupplierID from Suppliers
			where Country = 'USA'
	)



/* 430
  �ЦC�X��o�̦n�e�T�����~�C
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
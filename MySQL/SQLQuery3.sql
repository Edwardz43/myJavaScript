/*
string =>不需要計算的 varchar(寬度) 
number => int, decimal(5, 2) e.g. 123.45 , money
*/
--1
declare @i int = 0
set @i = 100
--2
declare @unitPrice decimal(10, 2)
select @unitPrice = UnitPrice
	from Products
	where ProductID = 18
	 
select @i, @unitPrice
go

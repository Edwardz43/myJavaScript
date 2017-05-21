use Northwind
go
------1-----
create procedure usp_ListProd as	
	select * from Products 
go

execute usp_ListProd
go

drop proc usp_ListProd
go
-----2------
create procedure usp_ListProd 
	@min money,
	@max money
as
	select * from Products where UnitPrice between @min and @max
go

execute usp_ListProd 10, 20 -- call by order 左小右大
execute usp_ListProd @min =10, @max =12 -- call by order 明確指定 不分左右

go

drop proc usp_ListProd
go

----3----
create procedure usp_ListProd 
	@min money = 0,
	@max money = 999
as
	select * from Products where UnitPrice between @min and @max
go

execute usp_ListProd  -- all
execute usp_ListProd @max = 12 -- 省略min
execute usp_ListProd @min = 13 -- 省略max
go

drop proc usp_ListProd
go

-----4----- 
create procedure usp_ListProd 
	@min money = null,
	@max money = null
as
	-- 如果沒給最小(大)值  就設一個預設最小(大)值給它
	if @min is null 
		set @min = 10
	if @max is null
		select @max = max(UnitPrice) from Products

	select * from Products where UnitPrice between @min and @max
go

execute usp_ListProd 
go

drop proc usp_ListProd
go


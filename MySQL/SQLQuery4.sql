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

execute usp_ListProd 10, 20 -- call by order ���p�k�j
execute usp_ListProd @min =10, @max =12 -- call by order ���T���w �������k

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
execute usp_ListProd @max = 12 -- �ٲ�min
execute usp_ListProd @min = 13 -- �ٲ�max
go

drop proc usp_ListProd
go

-----4----- 
create procedure usp_ListProd 
	@min money = null,
	@max money = null
as
	-- �p�G�S���̤p(�j)��  �N�]�@�ӹw�]�̤p(�j)�ȵ���
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


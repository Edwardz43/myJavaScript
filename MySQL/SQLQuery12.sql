use Northwind
go

select * from Products
go

create function fn_Prodouct (@type nvarchar(10))
returns @demo table
	(
		ProductID int,
		ProductInfo nvarchar(30)
	)
as
begin
	if @type = 'ID'
		insert @demo select  ProductID  from Products
	else if @type = 'Name'
		insert @demo select  ProductName  from Products
	return
end
go


select * from dbo.fn_Prodouct('ID')

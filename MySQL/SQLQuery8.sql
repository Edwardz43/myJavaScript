use Northwind
go

create table #temp
(
	PrdouctID int,
	UnitInStock int,
	Total int
)
go

select * from #temp

drop table #temp

begin
	DECLARE CursorLab CURSOR
	Keyset
	FOR 
	select ProductID, UnitsInStock from Products
		order by ProductID
	OPEN CursorLab
	declare @ProductID int = 0
	declare @UnitsInStock int = 0
	declare @SumUnitInStock int = 0
	FETCH NEXT FROM CursorLab into @ProductID, @UnitsInStock
	while (@@FETCH_STATUS = 0)
	begin
		set @SumUnitInStock = @SumUnitInStock + @UnitsInStock
		insert into #temp values (@ProductID, @UnitsInStock, @SumUnitInStock)
		
		FETCH NEXT FROM CursorLab into @ProductID, @UnitsInStock
	end
	CLOSE CursorLab
	deallocate CursorLab
end
-- µ²§ô½m²ß
CLOSE CursorLab
deallocate CursorLab

select * from #temp

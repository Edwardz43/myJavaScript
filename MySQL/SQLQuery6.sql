use Northwind
GO

-- �w�q Cursor (�Яd�N Keyset �ﶵ)
DECLARE CursorLab CURSOR
Keyset
FOR 
select ProductID, UnitsInStock from Products
  order by ProductID

-- �}�� Cursor
OPEN CursorLab

-- ���˵��Ĥ@�������e
-- @@FETCH_STATUS
print @@FETCH_STATUS


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
		print @ProductID
		print @UnitsInStock
		set @SumUnitInStock = @SumUnitInStock + @UnitsInStock
		print @SumUnitInStock
		print '------------------'
		FETCH NEXT FROM CursorLab into @ProductID, @UnitsInStock
	end
	CLOSE CursorLab
	deallocate CursorLab
end
-- �����m��
CLOSE CursorLab
deallocate CursorLab
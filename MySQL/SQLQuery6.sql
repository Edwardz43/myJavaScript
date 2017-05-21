use Northwind
GO

-- 定義 Cursor (請留意 Keyset 選項)
DECLARE CursorLab CURSOR
Keyset
FOR 
select ProductID, UnitsInStock from Products
  order by ProductID

-- 開啟 Cursor
OPEN CursorLab

-- 請檢視第一筆的內容
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
-- 結束練習
CLOSE CursorLab
deallocate CursorLab
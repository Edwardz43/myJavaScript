-- drop database testPick4DB
Create Database testPick4DB
go

use testPick4DB
go

-- digitals 資料表 內含 0-9 十個數字
create table digitals 
  (digi char(1) not null)
go

declare @iDigi int
set @iDigi = 0
while @iDigi <= 9
begin
  insert into digitals (digi) values (@iDigi)
  set @iDigi = @iDigi + 1
end
go
-- select * from digitals

-- 以 digitals 資料表 編組成 pair 資料表
-- pair 為 00-99 共一百個對彩數字
select r.digi as A, l.digi as B 
   into Pair 
   from digitals l cross join digitals r 
   order by A, B
go
-- select * from pair

-- 以 pair 資料表 編組成 AllNumber 資料表
-- AllNumbers 內含 0000-9999 共一萬個數字
select r.A as A, r.B as B, l.A as C, l.B as D 
  into AllNumbers 
  from Pair l cross join Pair r 
  order by A, B, C, D
-- drop table AllNumbers

-- drop table SimuData
-- 模擬開獎資料
Create Table SimuData
(
  Period varchar(6) not null primary key,
  Draw char(4) not null,
  Kind int null,
  BigSmall nchar(4) null,
  OddEven nchar(4) null,
  NumSum int null
)
go

declare @iCount int
declare @sPeriod varchar(6)
declare @sDraw varchar(4)

set @iCount = 1
while @iCount < 1000
begin
  set @sPeriod = substring(convert(varchar(4), @iCount + 1000), 2, 3)
  set @sDraw = convert(char(1), FLOOR(RAND()*10)) 
    + convert(char(1), FLOOR(RAND()*10))
    + convert(char(1), FLOOR(RAND()*10))
    + convert(char(1), FLOOR(RAND()*10))

  insert into SimuData (Period, Draw) values (@sPeriod, @sDraw)
  -- print @sDraw

  set @iCount = @iCount + 1
end
Go
-- select * from SimuData


Create function CBigSmall(@Value varchar(64)) returns varchar(64)
begin
  declare @Result varchar(64)
  declare @iLen int
  declare @i int
  declare @iDigi int
  set @iLen = len(@Value)
  set @Result = ''
  set @i = 1
  while @i <= @iLen
  begin
    set @iDigi = convert(int, substring(@Value, @i, 1))
    if @iDigi <= 4
       set @Result = @Result + '小'
    else
       set @Result = @Result + '大'
    set @i = @i + 1
  end
  return @Result
end
Go
-- select dbo.CBigSmall('4560')


Create function COddEven(@Value varchar(64)) returns varchar(64)
begin
  declare @Result varchar(64)
  declare @iLen int
  declare @i int
  declare @iDigi int
  set @iLen = len(@Value)
  set @Result = ''
  set @i = 1
  while @i <= @iLen
  begin
    set @iDigi = convert(int, substring(@Value, @i, 1))
    if (@iDigi % 2) = 0
       set @Result = @Result + '偶'
    else
       set @Result = @Result + '奇'
    set @i = @i + 1
  end
  return @Result
end
Go
-- select dbo.COddEven('1234')


Create function getSum(@Value varchar(64)) returns int as
begin
  declare @Result int
  declare @iLen int
  declare @i int
  declare @iDigi int
  set @iLen = len(@Value)
  set @Result = 0
  set @i = 1
  while @i <= @iLen
  begin
    set @iDigi = convert(int, substring(@Value, @i, 1))
    set @Result = @Result + @iDigi
    set @i = @i + 1
  end
  return @Result
end
Go
-- select dbo.getSum('4560')


Create function HowManyKind(@Value varchar(64)) returns int as
begin
  declare @Result int
  declare @iLen int
  declare @i int
  declare @sDigi char
  declare @sFound varchar(64)
  set @sFound = ''
  set @iLen = len(@Value)
  set @Result = 0
  set @i = 1
  while @i <= @iLen
  begin
    set @sDigi = substring(@Value, @i, 1)
    if charindex(@sDigi, @sFound) <= 0
      set @sFound = @sFound + @sDigi
    set @i = @i + 1
  end
  set @Result = len(@sFound)
  return @Result
end
Go
-- select dbo.HowManyKind('1213')


-- statistics data
update SimuData 
  set
  Kind = dbo.HowManyKind(Draw),
  BigSmall = dbo.CBigSmall(Draw),
  OddEven = dbo.COddEven(Draw),
  NumSum = dbo.getSum(Draw)
go

select * from SimuData
go

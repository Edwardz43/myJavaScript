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
-- 模擬開?資料
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


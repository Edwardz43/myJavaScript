use Northwind
go

create table t1 
(
	id int,
	name varchar(30)	
)

go

create table t2
(
	id int,
	name varchar(30)	
)

go

insert into t1 values(1, 'abc')
go

select * from t1
go

create trigger testTrigger on t1 for insert as
	insert into t2 
	select id, name
	from inserted 
go

insert into t1 values (2, 'def') 


select * from t1
select * from t2
go
	
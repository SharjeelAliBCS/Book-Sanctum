view to get every transaction:
create view transactions as
(
select to_char(date, 'YYYY-MM-DD') as date, name, amount,'other' as type from transaction
union
select to_char(order_date, 'YYYY-MM-DD') as date, book.isbn as name, round(price*quantity::numeric, 2) as amount,'book sale' as type from orders
inner join order_book on orders.order_number = order_book.order_number
inner join book on book.isbn = order_book.isbn
union
select to_char(order_date, 'YYYY-MM-DD') as date, publisher.name as name, round(-price*quantity*sale_percent::numeric, 2) as amount,'publisher fees' as type from orders
inner join order_book on orders.order_number = order_book.order_number
inner join book on book.isbn = order_book.isbn
inner join publisher on book.publisher_id = publisher.id
union
select to_char(date, 'YYYY-MM-DD') as date, concat(publisher.name, ': ', book.isbn,' x',quantity) as name, round(-price*sale_percent*quantity::numeric,2) as amount, 'restock' as type
from restock
inner join book on restock.isbn = book.isbn
inner join publisher on publisher.id = book.publisher_id
order by date desc
);
-------------------------------------------------------------------------------------
view to get every expenditure
create view expenditures as
(select date, name, amount,'other' as type from transaction
union
select order_date as date, publisher.name as name, round(-price*quantity*0.2::numeric, 2) as amount,'publisher fees' as type from orders
inner join order_book on orders.order_number = order_book.order_number
inner join book on book.isbn = order_book.isbn
inner join publisher on book.publisher_id = publisher.id
order by date desc
);
-------------------------------------------------------------------------------------
create address view
create view address as 
select * from  address_main  natural join address_second;
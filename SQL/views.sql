view to get every transaction:
create view transactions as
(select date, name, amount,'other' as type from transaction
union
select order_date as date, book.isbn as name, round(price*quantity::numeric, 2) as amount,'book sale' as type from orders
inner join order_book on orders.order_number = order_book.order_number
inner join book on book.isbn = order_book.isbn
union
select order_date as date, publisher.name as name, round(-price*quantity*0.2::numeric, 2) as amount,'publisher fees' as type from orders
inner join order_book on orders.order_number = order_book.order_number
inner join book on book.isbn = order_book.isbn
inner join publisher on book.publisher_id = publisher.id
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
view to get sales per day form transactions:
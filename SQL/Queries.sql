regex example. Insenstive case search for "water", "george r r martin"
select book.isbn,book.title,book.price,book.published_date, author.name as author, genre.name as genre_name from book
inner join author on author.id = book.author_id 
inner join genre on genre.id = book.genre_id 
inner join publisher on publisher.id = book.publisher_id 
where genre.name like '%fantasy%'
and book.published_date like '%2005%'
and (length('')= 0 or similarity(book.title,'') > 0.15 )
and (length('robert') = 0 or  similarity(author.name,'chris') > 0.15 )
and (length('') = 0 or  similarity(publisher.name,'') > 0.15 );
--------------------------------------------------
get 3 most newest books:
select * from book
order by published_date DESC
limit 3;
--------------------------------------------------
get all book info for a given isbn:
select book.isbn, book.title, book.description, book.price, book.page_count, book.stock, 
	   book.rating, book.rating_count, book.published_date, book.add_date, 
	   author.name as author, genre.name as genre, publisher.name as publisher
	   from book 
	   inner join author on book.author_id = author.id 
	   inner join genre on book.genre_id = genre.id
	   inner join publisher on book.publisher_id = publisher.id
where isbn = '9780451207142';
--------------------------------------------------
Get genre counts for a given search:
select name, count(*)
from (select * from book
where title ILIKE search) as search
inner join genre on search.genre_id = genre.id
group by (name);
--------------------------------------------------
delete all data
delete from book;
delete from author;
delete from publisher;
delete from genre;
drop table book;
drop table author;
drop table publisher;
drop table genre;
--------------------------------------------------
fill test_user:
insert into client values ('LordofArbiters', 'sharjeelali2552@gmail.com', 'Sharjeel', 'Ali', '12345');
--------------------------------------------------
fill status:
insert into status values('0', 'Order Processing', 'Your order is currently being processed. This should only take a few minutes.');
insert into status values('1', 'Order Preparing', 'Your order is currently being selected from our warehouse, and will be shipped soon.');
insert into status values('2', 'Shipped', 'Your order has shipped. Expect arrival in the coming days.');
insert into status values('3', 'Out for Delivery', 'Your order is out for delivery and will arive by the end of the day. ');
insert into status values('4', 'Delivered', 'Your order has been delivered.');
--------------------------------------------------
check login info
select username from client
where (LOWER(username) = LOWER('ddd') 
or LOWER(email) = LOWER('randomemail@gmail.com'))
AND password = '12345';
--------------------------------------------------
add book to cart:
insert into cart values('LordofArbiters','9780062498533',3)
on conflict (username, isbn) do update
       set quantity = 3
       where 'LordofArbiters' = cart.username and '9780062498533' = cart.isbn; 

--------------------------------------------------
get cart for a user:
select book.isbn,book.title,book.price,cart.quantity from book
inner join cart on book.isbn = cart.isbn
where cart.username = 'username';

--------------------------------------------------
Add new order:
insert into order values ('LordofArbiters', '1', 'Mar 23');

--------------------------------------------------
get all orders for a user:
select orders.order_date, book.isbn, book.title, author.name, book.price, order_book.quantity, order_book.order_number
from order_book 
inner join orders on orders.order_number = order_book.order_number 
inner join book on order_book.isbn = book.isbn
inner join author on book.author_id = author.id
where orders.username = 'user'
order by order_book.order_number desc;

 
------------------------------------------------
Insert a new address:
insert into address values(default,'Canada', 'ON','Ottawa', 'K3Q6M2', 'Exaclior',234, 117);
insert into client_address values('LordofArbiters', 1);
------------------------------------------------
Select all addresses belonging to user:
select address.country, address.state, address.city, address.code, address.street,address.apt_number from address
inner join client_address on address.id = client_address.address_id
where username = 'LordofArbiters';
------------------------------------------------
Get most sold books (For home page):
select book.isbn, book.title, book.price, author.name from
(select isbn, sum(quantity) as sales from order_book
group by(isbn) ) as sold
inner join book on sold.isbn = book.isbn
inner join author on book.author_id = author.id 
order by sales desc
limit 10;

select book.isbn, book.title, book.price,author.name
from book left join author on author.id = book.author_id
order by book.add_date DESC
limit $1;
------------------------------------------------
Get most recently viewed books (For home page):
select book.isbn, book.title, book.price, author.name from
inner join view_history on book.isbn = view_history.isbn
inner join book on sold.isbn = book.isbn
inner join author on book.author_id = author.id 
where view_history.username = $1
order by sales desc
------------------------------------------------
get recent books for user:
select book.isbn, book.title, view_history.rank from view_history
inner join book on book.isbn = view_history.isbn;

------------------------------------------------
get sales history:
select order_date, sum(price*quantity) from orders
inner join order_book on orders.order_number = order_book.order_number
inner join book on book.isbn = order_book.isbn
group by order_date;
------------------------------------------------
Populate orders with data:
SELECT isbn FROM book OFFSET floor(random()*2699) LIMIT 1;
insert into orders values (default, 'test', '03/02/2020');


insert into order_book(isbn, order_number, quantity)
   select isbn, new.order_number, floor(random() * 5 + 1)::int
   from book 
   offset floor(random()*2699) limit 1;
------------------------------------------------
get entire book revenue:
select sum(price*quantity) from order_book
inner join book on book.isbn = order_book.isbn;
------------------------------------------------
get entire book genre sales by percent
select name, round(100*sum(quantity)/
(select sum(quantity) from order_book)::numeric, 2) as sold
from order_book
inner join book on book.isbn = order_book.isbn
inner join genre on book.genre_id = genre.id
group by genre.name;

------------------------------------------------
get entire book genre sales for top 10:

select name, sum(quantity)
from order_book
inner join book on book.isbn = order_book.isbn
inner join genre on book.genre_id = genre.id
group by genre.name
order by sum desc
limit 10;
------------------------------------------------
get all book sales:
select order_date, book.isbn, price*quantity as sales, book.title from orders
inner join order_book on orders.order_number = order_book.order_number
inner join book on book.isbn = order_book.isbn
order by order_date;

------------------------------------------------
get all daily sales:
select distinct(transactions.date), daily.sum from transactions
left outer join 
(select date, sum(amount) from transactions 
where type = 'book sale' 
group by date) as daily
on daily.date = transactions.date 
order by date desc
;
------------------------------------------------
get all 6 types of sale information
select
	count(case when type='book sale' then 1 else 0 end) as sold,
    sum(amount) as profit,
    sum(case when amount > 0 then amount else 0 end) as sales,
    sum(case when amount < 0 then -amount else 0 end) as expenditures
    sum(case when type ='publisher fees' then -amount else 0 end) as publisher_fees,
    sum(case when type = 'other' then -amount else 0 end) as other
from transactions
------------------------------------------------
get total sales one after the other per day:
select date, sum(amount) over (order by date) from 
(select date, sum(amount) as amount from transactions group by date ) as daily;

------------------------------------------------
get list of requested books
select  request_book.request_number, username, request_isbn as isbn, request_title as title, request_book.date as req_date,
admin_decides.date as desc_date, last_name
from request_book
left outer join admin_decides on admin_decides.request_number = request_book.request_number
left outer join admin on admin.email = admin_decides.email;

------------------------------------------------
get random number
select round( ((random() * 30 + 5)/100)::numeric, 2)
------------------------------------------------
get quantity of book from last 30 days
select sum(quantity)
from orders
inner join order_book on orders.order_number = order_book.order_number
where order_date > current_timestamp - interval '30 day' and isbn = '9780060929879';
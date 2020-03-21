regex example. Insenstive case search for "halo"
where $1 is '%halo%': 
select book.isbn,book.title,book.price,author.name 
from book left join author on author.id = book.author_id
where title ILIKE $1;

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


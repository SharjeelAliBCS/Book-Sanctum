View the fill_data.sql file for insertion queries. 
SEARCH QUERIES:
----------------------------------------------------------------------------------------------------
get a publisher by name
select * from publisher
inner join address on publisher.address_id = address.id
where name=$1;

--------------------------------------------------
get a list of every isbn limited to a set length ($1)
select isbn from book where removed=false order by isbn limit $1

--------------------------------------------------
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
----------------------------------------------------------------------------------------------------
SALES QUERIES:
--------------------------------------------------
Get total book sales accumlated over time (Using the over keyword), filtered between two dates:
select date, sum(amount) over (order by date) from
(select date, sum(amount) as amount from transactions
where date >=$1 and date<=$2
group by date ) as daily;
get 3 most newest books:
select * from book
order by published_date DESC
limit 3;

------------------------------------------------
get sales history:
select order_date, sum(price*quantity) from orders
inner join order_book on orders.order_number = order_book.order_number
inner join book on book.isbn = order_book.isbn
group by order_date;

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
get all 7 types of sale information as a single number
select
    count(case when type='book sale' then 1 else 0 end) as sold,
    sum(amount) as profit,
    sum(case when amount > 0 then amount else 0 end) as sales,
    sum(case when amount < 0 then -amount else 0 end) as expenditures
    sum(case when type ='publisher fees' then -amount else 0 end) as publisher_fees,
    sum(case when type = 'other' then -amount else 0 end) as other
    sum(case when type = 'restock' then -amount else 0 end) as restock
from transactions

----------------------------------------------------------------------------------------------------
REQUEST BOOK QUERIES:
--------------------------------------------------
Get client request book list:
select  request_book.request_number, username, request_isbn as isbn, 
request_title as title, request_book.date  as req_date,
admin_decides.date as desc_date, decision 
from request_book 
left outer join admin_decides on admin_decides.request_number = request_book.request_number
where username = $1
order by request_book.request_number desc

--------------------------------------------------
Get all book requests:
select  request_book.request_number, username, request_isbn as isbn, 
request_title as title, request_book.date  as req_date,
admin_decides.date as desc_date, last_name, decision
from request_book "+
left outer join admin_decides on admin_decides.request_number = request_book.request_number 
left outer join admin on admin.email = admin_decides.email 
order by request_book.request_number desc;

----------------------------------------------------------------------------------------------------
ORDER BOOK QUERIES:
--------------------------------------------------
Get all orders for a specific username:
select orders.order_date, book.isbn, book.title, author.name as author,status.name as status, 
book.price, order_book.quantity, order_book.order_number, 
orders.card_number, address.code, address.street, address.unit, address.region,address.city 
from order_book 
inner join orders on orders.order_number = order_book.order_number 
inner join book on order_book.isbn = book.isbn 
inner join author on book.author_id = author.id 
inner join address on orders.address_id = address.id
inner join status on orders.status = status.status_id
where orders.username = $1
order by order_book.order_number desc;

----------------------------------------------------------------------------------------------------
CLIENT HOME PAGE QUERIES:
--------------------------------------------------
Get Most sold books:
select book.isbn, book.title, book.price, author.name as author from 
(select isbn, sum(quantity) as sales from order_book 
group by(isbn) ) as sold 
inner join book on sold.isbn = book.isbn 
inner join author on book.author_id = author.id 
order by sales desc 
limit 10;

--------------------------------------------------
Get recently viewed books for a user:
select book.isbn, book.title, book.price, author.name as author from book 
inner join view_history on book.isbn = view_history.isbn 
inner join author on book.author_id = author.id  
where view_history.username = $1 
order by view_history.rank;

--------------------------------------------------
Get recently added books sorted by their add date:
select book.isbn, book.title, book.price,author.name 
from book left join author on author.id = book.author_id 
order by book.add_date DESC 
limit $1;

----------------------------------------------------------------------------------------------------
CART TAB QUERIES:
--------------------------------------------------
Get the list of books and their quantites from the user's cart:
select book.isbn,book.title,book.price,cart.quantity from book 
inner join cart on book.isbn = cart.isbn 
where cart.username = $1;

----------------------------------------------------------------------------------------------------
BOOK QUERIES:
--------------------------------------------------
Get all book information by its isbn
select book.isbn, book.title, book.description, book.price, book.page_count, book.stock, 
	   book.rating, book.rating_count, book.published_date, book.add_date, 
	   author.name as author, genre.name as genre, publisher.name as publisher
	   from book 
	   inner join author on book.author_id = author.id 
	   inner join genre on book.genre_id = genre.id
	   inner join publisher on book.publisher_id = publisher.id
where isbn = $1;

--------------------------------------------------
Remove a book by setting its removed attribute to true:
update book set removed = true where isbn = $1

----------------------------------------------------------------------------------------------------
ACCOUNT QUERIES:
--------------------------------------------------
Validate that a user's login email is correct
select email from client where lower(email) = lower($1);

select username from client 
where (LOWER(username) = LOWER($1) 
or LOWER(email) = LOWER($1) )
AND password = $2;

--------------------------------------------------
Validate that an admin's login information is correct:
select email from admin 
where LOWER(email) = LOWER($1) 
AND password = $2;

--------------------------------------------------
Get all addresses belonging to a specified username:
select address.id, address.region, address.city, address.code, 
address.street, address.unit from address 
inner join client_address on address.id = client_address.address_id 
where username = $1;


----------------------------------------------------------------------------------------------------
OTHER QUERIES:
--------------------------------------------------

Get all payment cards belonging to a specified username:
select card_info.card_number, card_info.name, card_info.expiry_date from card_info "+
onner join client_billing on card_info.card_number = client_billing.card_number 
where username = $1;


------------------------------------------------
get random number
select round( ((random() * 30 + 5)/100)::numeric, 2)
------------------------------------------------
get quantity of book from last 30 days
select sum(quantity)
from orders
inner join order_book on orders.order_number = order_book.order_number
where order_date > current_timestamp - interval '30 day' and isbn = '9780060929879';
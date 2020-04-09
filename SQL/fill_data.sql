fill status:
insert into status values(default, 'Order Processing', 'Your order is currently being processed. This should only take a few minutes.');
insert into status values(default, 'Order Preparing', 'Your order is currently being selected from our warehouse, and will be shipped soon.');
insert into status values(default, 'Shipped', 'Your order has shipped. Expect arrival in the coming days.');
insert into status values(default, 'Out for Delivery', 'Your order is out for delivery and will arive by the end of the day. ');
insert into status values(default, 'Delivered', 'Your order has been delivered.');
--------------------------------------------------
fill warehouse:
insert into address_second values('K5D2X9', 'Nepean');
insert into address_main values(default, 'ON', 'K5D2X9', '45 Northshirien Rd', 4);
insert into warehouse values(default, 1);
--------------------------------------------------
Insert a new client:
insert into client values ('test', 'test@gmail.com', 'test, 'trst', '12345');
--------------------------------------------------
Add new order:
insert into order values ('LordofArbiters', '1', 'Mar 23');
------------------------------------------------
Insert a new address:
insert into address values(default,'Canada', 'ON','Ottawa', 'K3Q6M2', 'Exaclior',234, 117);
insert into client_address values('LordofArbiters', 1);
------------------------------------------------
Populate orders with data:
SELECT isbn FROM book OFFSET floor(random()*2699) LIMIT 1;
insert into orders values (default, 'test', '03/02/2020');

insert into order_book(isbn, order_number, quantity)
   select isbn, new.order_number, floor(random() * 5 + 1)::int
   from book 
   offset floor(random()*2699) limit 1;

------------------------------------------------
Populate orders with data:
insert into transaction values (default, $1, $2, $3);

------------------------------------------------
Populate decides with data:
insert into admin_decides values ($2, $1, $3, default)

------------------------------------------------
Populate request with data
insert into request_book values (default, $1, $2, $3, default)

------------------------------------------------
Insert a book into the cart or modify it (The conclict inserts if it doesnt exist or else it modifies the quantity):
insert into cart values($1, $2, $3) 
on conflict (username, isbn) do update 
set quantity = $3 
where $1 = cart.username and $2 = cart.isbn;

------------------------------------------------
Insert a new book
insert into book values($1, $2, $3, $4, $5, $6, $7, $8, $9, default, false, $10);

------------------------------------------------
Insert a new genre
insert into genre values(default, $1, $2) returning id;

------------------------------------------------
Insert a new author
insert into author values(default, $1) returning id;

------------------------------------------------
Insert a new publisher
insert into publisher values(default, $1, $2, $3, $4, $5, $6);

------------------------------------------------
Insert a viewed book into the view_history
insert into view_history values($1, $2, 0)

------------------------------------------------
Insert a user's address
INSERT INTO client_address VALUES ($1, $2);

------------------------------------------------
Insert a user's payment info:
INSERT INTO client_billing VALUES ($1, $2);

------------------------------------------------
Insert a main address info:
INSERT INTO address_main values (default, $1, $2, $3, $4) RETURNING id;

------------------------------------------------
Insert a second address (Code, city) info:
INSERT INTO address_second values ($1, $2);

------------------------------------------------
Sign up as a new client
insert into client values ($1, $2, $3, $4, $5);

------------------------------------------------
Insert a new card
INSERT INTO card_info values ($1, $2, $3);
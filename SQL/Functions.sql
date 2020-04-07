delete book from cart if its quantity is set to 0:
create function remove_from_cart() 
   returns trigger as
$BODY$
begin
   IF new.quantity = 0  then
       delete from cart
       where new.username = username and new.isbn = isbn;
   end if;
   return new;
end;
$BODY$ language plpgsql
-----------------------------------------------------------------------------
delete all books from the cart for a user after inserting them into order:
create function insert_order_book()
   returns trigger as
$BODY$
begin
   insert into order_book(isbn, order_number, warehouse_id, quantity)
   select isbn, new.order_number, 1 as warehouse_id quantity
   from cart
   where username = new.username;

   delete from cart
   where username = new.username;
   return new;
end;
$BODY$ language plpgsql

-----------------------------------------------------------------------------
add random books to order:
create function random_order()
   returns trigger as
$BODY$
begin
   insert into order_book(isbn, order_number, quantity)
   select isbn, new.order_number, SELECT floor(random() * 5 + 1)::int;
   from book 
   offset floor(random()*2699) limit 1;
      
   return new;
end;
$BODY$ language plpgsql



-----------------------------------------------------------------------------
delete all books from the cart for a user after inserting them into order:
create function insert_order_book()
   returns trigger as
$BODY$
begin
   9780553573428
   
   return new;
end;
$BODY$ language plpgsql

-----------------------------------------------------------------------------
update all previous books in history for the given user:
create function update_view_history()
   returns trigger as
$BODY$
begin 
   if (new.isbn in (select isbn from view_history where username= new.username)) then
    update view_history
    set rank =rank+1
    where username = new.username and rank< (select rank from view_history where username= new.username and isbn = new.isbn);

    delete from view_history
    where username = new.username and isbn = new.isbn;
   
   else
    update view_history
    set rank =rank+1
    where username = new.username;

    delete from view_history
    where rank >=9 and username = new.username;
   end if;
   return new;
end;
$BODY$ language plpgsql

-----------------------------------------------------------------------------
restock a book:
create function restock_book_func()
   returns trigger as
$BODY$
begin 
    update warehouse_books
    set stock = stock+ new.quantity
    where warehouse_books.isbn = new.isbn
    return new;
end;
$BODY$ language plpgsql

-----------------------------------------------------------------------------
update book stocks:
create function update_stock()
   returns trigger as
$BODY$
begin 
    update warehouse_books
   set stock = stock- cart_book.quantity
   from
    (select isbn, quantity from order_book where order_number =new.order_number) as cart_book
   where warehouse_books.isbn = cart_book.isbn;
   
   insert into restock (warehouse_id, isbn, quantity, date)
	select 1, order_book.isbn, sum(quantity), (select order_date from orders where here order_number =new.order_number limit 1) 
	from orders
	inner join order_book on orders.order_number = order_book.order_number
	inner join warehouse_books on order_book.isbn = warehouse_books.isbn
	where order_date > order_date - interval '30 day' and warehouse_books.stock<=5
	group by (order_book.isbn);
   return new;
end;
$BODY$ language plpgsql
-----------------------------------------------------------------------------
add book to warehouse
create function add_warehouse_book()
   returns trigger as
$BODY$
begin 
    insert into warehouse_books values(1, new.isbn, 10);
   return new;
end;
$BODY$ language plpgsql

-----------------------------------------------------------------------------
remove book from cart and history:
create function remove_book_func()
   returns trigger as
$BODY$
begin 
    delete from cart where isbn in 
    (select isbn from book where removed = true);
    delete from view_history where isbn in 
    (select isbn from book where removed = true);
    return new;
end;
$BODY$ language plpgsql
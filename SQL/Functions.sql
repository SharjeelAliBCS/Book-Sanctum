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
   insert into order_book(isbn, order_number, quantity)
   select isbn, new.order_number, quantity
   from cart
   where username = new.username;

   delete from cart
   where username = new.username;
   return new;
end;
$BODY$ language plpgsql
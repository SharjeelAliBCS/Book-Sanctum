Alter cart quantity:
create trigger change_cart_quantity after update on cart
for each row
execute procedure remove_from_cart();

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
Add books to order_book:
create trigger checkout_order after insert on orders
for each row
execute procedure insert_order_book();

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

    
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
   insert into order_book(isbn, order_number, quantity)
   select isbn, new.order_number, quantity
   from cart
   where username = new.username;

   delete from cart
   where username = new.username;
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
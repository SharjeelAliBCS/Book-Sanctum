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
    
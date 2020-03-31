Alter cart quantity:
create trigger change_cart_quantity after update on cart
for each row
execute procedure remove_from_cart();
-----------------------------------------------------------------------------
Add books to order_book:
create trigger checkout_order after insert on orders
for each row
execute procedure insert_order_book();
-----------------------------------------------------------------------------
Update the view_history on new insert:
create trigger trig_view_history before insert on view_history
for each row
execute procedure update_view_history();


    
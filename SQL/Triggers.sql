Alter cart quantity:
create trigger change_cart_quantity after update on cart
for each row
execute procedure remove_from_cart();
-----------------------------------------------------------------------------
Add books to order_book:
create trigger checkout_order after insert on orders
for each row
execute procedure insert_order_book();


    
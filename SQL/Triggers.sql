Alter cart quantity:
create trigger change_cart_quantity after update on cart
for each row
execute procedure remove_from_cart();
-----------------------------------------------------------------------------
Add books to order_book:
create trigger checkout_order after insert on orders
for each row
execute procedure insert_order_book();
ALTER TABLE orders DISABLE TRIGGER checkout_order;
-----------------------------------------------------------------------------
Update the view_history on new insert:
create trigger trig_view_history before insert on view_history
for each row
execute procedure update_view_history();
-----------------------------------------------------------------------------
update stocks:
create trigger update_stock_trig after insert on order_book
for each row
execute procedure update_stock();

-----------------------------------------------------------------------------
update stock whenever an insert into restock is done:
create trigger restock_book_trig after insert on restock
for each row
execute procedure restock_book_func();
-----------------------------------------------------------------------------
add book to warehouse after insert into book:
create trigger insert_new_book after insert on book
for each row
execute procedure add_warehouse_book();

-----------------------------------------------------------------------------
removed book from history and all carts:
create trigger remove_book after update on book
for each row
execute procedure remove_book_func();

    
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
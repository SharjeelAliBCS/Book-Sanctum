create table address_second(
	code			varchar(6),
	region	        	varchar(10),
	city			varchar(20),
	primary key (code)
);

create table address_main(
	id	    		serial,	
	code			varchar(6),
	street			varchar(30),
	unit			numeric(4,0),
	primary key (id),
	foreign key (code) references address_second
);

create table payment_info(
	card_number		numeric(16,0),
	name			varchar(30),
	expiry_date		varchar(5),
	primary key (card_number)
);

create table author(
	 id		        varchar(5), 
	 name		        varchar(50),
	 primary key (id)
);
create table genre(
	 id		        varchar(5), 
	 name		        varchar(50),
         type                   varchar(15),
	 primary key (id)
);
create table publisher(
	 id		        varchar(5), 
	 name		        varchar(200),
         phone                  varchar(10),
         email                  varchar(230),
	 address_id		serial,
	 transit_number		numeric(5,0),
	 account_number		numeric(9,0),
	 institution_number	numeric(3,0),
	 primary key (id),
	 foreign key (address_id) references address_main(id)
);

create table book(
	 isbn			varchar(13), 
	 title			varchar(500),
         description            varchar(8000), 
	 author_id		varchar(5), 
	 genre_id               varchar(5),
         publisher_id           varchar(5),
         price                  numeric(5,2),
         page_count             numeric(4,0),
         rating                 numeric(2,1),
         rating_count           numeric(5,0),
         published_date         varchar(15),
         date			varchar(10),
	 removed		boolean,
	 primary key (isbn),
	 foreign key (author_id) references author(id),
	 foreign key (genre_id) references genre(id),
         foreign key (publisher_id) references publisher(id)
);

create table warehouse(
	id			serial,
	address_id		serial,
	primary key (id),
	foreign key (address_id) references address_main(id)
);

create table warehouse_books(
	warehouse_id		serial,
	isbn			varchar(13),
	stock                   numeric(4,0),
	primary key (warehouse_id, isbn),
	foreign key (isbn) references book,
	foreign key (warehouse_id) references warehouse (id)
);

create table client(
	username		varchar(20),
	email			varchar(40),
	first_name		varchar(10),
	last_name		varchar(10),
	password		varchar(15),
	primary key (username)
);

create table cart(
	username		varchar(20),
	isbn			varchar(13),
	quantity		numeric(3,0),
	primary key (username, isbn),
	foreign key (username) references client,
	foreign key (isbn) references book
);

create table view_history(
	username		varchar(20),
	isbn			varchar(13),
	rank                    numeric(1,0),
	primary key (username, isbn),
	foreign key (username) references client,
	foreign key (isbn) references book
);

create table status(
	status_id		varchar(5),
	name			varchar(30),
	description		varchar(500),
	primary key (status_id)
);

create table orders(
	order_number	    	serial,	
	username	        varchar(20),
	date			varchar(10),
	primary key (order_number)
);

create table order_book(
	isbn			varchar(13),
	order_number	    	serial,
	warehouse_id		serial,
	quantity		numeric(3,0),
	primary key (order_number,isbn),
	foreign key (order_number) references orders,
	foreign key (warehouse_id,isbn) references warehouse_books
);

create table client_address(
	username	        varchar(20),
	address_id		serial,
	primary key (username, address_id),
	foreign key (username) references client,
	foreign key (address_id) references address_main(id)
);


create table client_billing(
	card_number		numeric(16,0),
	name			varchar(30),
	primary key (username, card_number),
	foreign key (username) references client,
	foreign key (card_number) references payment_info
);

create table restock(
	restock_number		serial,
	warehouse_id		serial,
	isbn			varchar(13),
	quantity		numeric(3,0),
	date			varchar(10),
	primary key (restock_number),
	foriegn key (warehouse_id, isbn) references warehouse_books
);

create table admin(
	email			varchar(40) not null,
	first_name		varchar(10),
	last_name		varchar(10),
	password		varchar(15) not null,
	primary key (email)
);

create table transaction(
	transaction_id		serial,
	name			varchar(30) not null,
	amount			numeric(6,2)not null,
	date			varchar(10) not null,
	primary key (transaction_id)
);

create table sales_report(
	report_number		serial,
	email			varchar(40),
	start_date		varchar(10),
	end_date		varchar(10),
	file			VAR	
	primary key (report_number),
	foreign key (email) references admin
);

create table request_book(
	request_number		serial,
	username		varchar(20),
	request_isbn		varchar(13), 
	request_title		varchar(500),
	date			varchar(10),		
	primary key (request_number),
	foreign key (username) references client
);

create table admin_decides(
	request_number		serial,
	email			varchar(40),
	primary key (request_number, email),
	foreign key (email) references admin
);
	

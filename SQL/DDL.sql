/*this creates the second address table which stores the postal code and city.*/
create table address_second(
	code			varchar(6),
	city			varchar(20) not null,
	primary key (code)
);

/*this creates the main address information*/
create table address_main(
	id	    		serial,	
	region	        	varchar(2)
	check (region in ('AB', 'BC', 'MB', 'NB', 'NL','NT','NS','NU','ON','PE','QC','SK','YT') ),
	code			varchar(6) not null,
	street			varchar(30) not null,
	unit			numeric(4,0) not null,
	primary key (id),
	foreign key (code) references address_second
);

/*This creates the user payment info for their order/account*/
create table card_info(
	card_number		numeric(16,0),
	name			varchar(30) not null,
	expiry_date		varchar(5) not null,
	primary key (card_number)
);

/*This creates the author table used for book*/
create table author(
	 id		        serial, 
	 name		        varchar(50) not null,
	 primary key (id)
);

/*This creates the genre table used for book*/
create table genre(
	 id		        serial, 
	 name		        varchar(50) not null,
         type                   varchar(15),
	 primary key (id)
);

/*This creates the publisher table used for book*/
create table publisher(
	 id		        serial, 
	 name		        varchar(200)  not null,
         phone                  varchar(12)  not null,
         email                  varchar(230)  not null,
	 address_id		serial  not null,
	 routing_number		numeric(9,0)  not null,
	 account_number		numeric(10,0)  not null,
	 primary key (id),
	 foreign key (address_id) references address_main(id)
);

/*This creates the book table*/
create table book(
	 isbn			varchar(13), 
	 title			varchar(500) not null,
         description            varchar(8000) not null, 
	 author_id		serial not null, 
	 genre_id               serial  not null,
         publisher_id           serial   not null,
         price                  numeric(5,2)  not null,
         page_count             numeric(4,0)  not null,
         published_year		numeric(4,0)  not null,
         add_date		date not null default current_date,
	 removed		boolean  not null,
	 sale_percent		numeric(5,2)  not null,
	 primary key (isbn),
	 foreign key (author_id) references author(id),
	 foreign key (genre_id) references genre(id),
         foreign key (publisher_id) references publisher(id)
);

/*This creates the warehouse that stores the books*/
create table warehouse(
	id			serial,
	address_id		serial  not null,
	primary key (id),
	foreign key (address_id) references address_main(id)
);

/*This creates the warehouse book relation that holds each book*/
create table warehouse_books(
	warehouse_id		serial,
	isbn			varchar(13)  not null,
	stock                   numeric(4,0)  not null,
	primary key (warehouse_id, isbn),
	foreign key (isbn) references book,
	foreign key (warehouse_id) references warehouse (id)
);

/*This creates the client username table, storing each user/client*/
create table client(
	username		varchar(20),
	email			varchar(40)  not null,
	first_name		varchar(10),
	last_name		varchar(10),
	password		varchar(15)  not null,
	primary key (username)
);

/*This creates the client's cart which stores each book they can "save"*/
create table cart(
	username		varchar(20),
	isbn			varchar(13),
	quantity		numeric(3,0)  not null,
	primary key (username, isbn),
	foreign key (username) references client,
	foreign key (isbn) references book
);

/*This creates the table which stores a client's view history per book*/
create table view_history(
	username		varchar(20),
	isbn			varchar(13),
	rank                    numeric(1,0)  not null,
	primary key (username, isbn),
	foreign key (username) references client,
	foreign key (isbn) references book
);

/*This creates the table which contains all the tracking information (as name or description).*/
create table status(
	status_id		serial,
	name			varchar(30)  not null,
	description		varchar(500)  not null,
	primary key (status_id)
);

/*This creates the orders table which stores each order done by the client*/
create table orders(
	order_number	    	serial,	
	username	        varchar(20)   not null,
	order_date		date not null default current_date,
	card_number		numeric(16,0) not null,
	address_id		serial not null,
	status			serial   not null,
	foreign key (status) references status,
	foreign key (username) references client,
	foreign key (card_number) references card_info,
	foreign key (address_id) references address_main(id),
	primary key (order_number)
);

/*This creates the table which stores each book for a given order*/
create table order_book(
	isbn			varchar(13),
	order_number	    	serial,
	warehouse_id		serial not null,
	quantity		numeric(3,0)  not null,
	primary key (order_number,isbn),
	foreign key (order_number) references orders,
	foreign key (warehouse_id,isbn) references warehouse_books
);

/*This creates the client address table whichs stores each client's address*/
create table client_address(
	username	        varchar(20),
	address_id		serial not null,
	primary key (username, address_id),
	foreign key (username) references client,
	foreign key (address_id) references address_main(id)
);

/*This creates the table which stores each client's payment information*/
create table client_billing(
	card_number		numeric(16,0),
	username                varchar(20),
	primary key (username, card_number),
	foreign key (username) references client,
	foreign key (card_number) references card_info
);

/*This creates the restock table, which contains a record for each book restock email order*/
create table restock(
	restock_number		serial,
	warehouse_id		serial,
	isbn			varchar(13),
	quantity		numeric(3,0)  not null,
	date			date not null default current_date,
	primary key (restock_number),
	foriegn key (warehouse_id, isbn) references warehouse_books
);

/*This creates the admin table which stores the admin information.*/
create table admin(
	email			varchar(40) not null,
	first_name		varchar(10),
	last_name		varchar(10),
	password		varchar(15) not null,
	primary key (email)
);

/*This stores the other transaction information*/
create table transaction(
	transaction_id		serial,
	name			varchar(30) not null,
	amount			numeric(6,2)not null,
	date			date not null default current_date,
	primary key (transaction_id)
);

/*This creates the table which stores the request_book infomration, which is a bonus.*/
create table request_book(
	request_number		serial,
	username		varchar(20) not null,
	request_isbn		varchar(13),
	request_title		varchar(500),
	date			date not null default current_date,
	primary key (request_number),
	foreign key (username) references client on delete cascade
);

/*This creates the table which stores the admin descision on a book request*/
create table admin_decides(
	request_number		serial,
	email			varchar(40),
	decision		bool not null,
	date			date not null default current_date,
	primary key (request_number, email),
	foreign key (request_number) references request_book on delete cascade,
	foreign key (email) references admin on delete cascade
);
	

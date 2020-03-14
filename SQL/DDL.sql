create table book
	(isbn			varchar(13), 
	 title			varchar(500),
         description            varchar(5000), 
	 author_id		varchar(5), 
	 genre_id               varchar(5),
         price                  numeric(5,2),
         page_count             numeric(4,0),
         stock                  numeric(4,0),
         rating                 numeric(2,1),
         published_date         varchar(15),
         add_date               varchar(15),
	 primary key (isbn),
	 foreign key (author_id) references author,
	 foreign key (genre_id) references genre
	);
create table author
	(author_id		varchar(5), 
	 author_name		varchar(50),
	 primary key (author_id)
	);
create table genre
	(genre_id		varchar(5), 
	 genre_name		varchar(50),
	 primary key (genre_id)
	);


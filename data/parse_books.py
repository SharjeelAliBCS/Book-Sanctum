import gzip
import itertools
import json

def read_edition_file(filename,start, size,out):
    data = []
    with gzip.open(filename,'rb') as f:
        print("size of file is ", )

        for line in itertools.islice(f, start, start+size):
            sp=line.split("\t")[4]
            sp = json.loads(sp)
            #sp = eval(json.dumps(sp))

            #print(sp) #prints keys
            #print(sp["name"])
            #print(sp.keys())

            temp = {"key": sp["key"]}

            #'publishers', 'identifiers', 'subtitle', 'last_modified', 'title', 'type', 'number_of_pages', 'isbn_13', 'edition_name', 'languages', 'isbn_10', 'latest_revision', 'key', 'authors', 'publish_date', 'works', 'physical_format', 'subjects', 'revision'
            keys = ["publishers", "isbn_13","subjects","title","number_of_pages","isbn_10","authors"]
            c = 0
            for key in keys:
                if(key in sp):
                    temp[key] = sp[key]
                    c+=1


            #print(temp)
            if(c==len(keys)):
                data.append(temp)


            #data.setdefault("data",[]).append({"text": sp[-1],"id": sp[0]})


            #print('got line', line)

        output_json(data,out)

def read_author_file(filename,start, size,out):
    data = []
    with gzip.open(filename,'rb') as f:
        print("size of file is ", )

        for line in itertools.islice(f, start, start+size):
            sp=line.split("\t")[4]
            sp = json.loads(sp)
            sp = eval(json.dumps(sp))

            #print(sp) #prints keys
            #print(sp["name"])

            temp = {"key": sp["key"]}
            if("name" in sp):
                temp["name"] = sp["name"]
                if("\\" not in temp["name"]):
                    data.append(temp)


            #data.setdefault("data",[]).append({"text": sp[-1],"id": sp[0]})


            #print('got line', line)

        output_json(data,out)

#read_file('ol_dump_authors_2020-02-29.txt.gz',0,2)

def output_json(data,out):
    print("saving {} lines of json".format(len(data)))
    with open(out, 'w') as json_file:
        json.dump(data, json_file,indent=4, sort_keys=True )

def read_json(file_name):
    new_data = []
    start_size = 0
    new_size = 0
    with open(file_name) as f:
        data = json.load(f)
        start_size = len(data)
        for book in data:
            if(book["page_count"]!=0 and len(book["publishers"])!=0):
                book.pop('goodreads_id', None)
                new_data.append(book)
        new_size = len(new_data)
        print("old size is {}. Lost {}. New size {}".format(start_size, start_size-new_size, new_size))
        output_json(new_data)



def saveCSV(file):
    in_txt = csv.reader(file, delimiter = '\t')
    out_csv = csv.writer(open("test.csv", 'wb'))
    out_csv.writerows(in_txt)

#read_json("../comp3005W20-project/data/bookdata.json");

read_edition_file("ol_dump_editions_2020-02-29.txt.gz", 1, 1000000,"cleanedEditions.json")
#read_author_file("ol_dump_authors_2020-02-29.txt.gz", 1, 900000,"cleanedAuthors.json")

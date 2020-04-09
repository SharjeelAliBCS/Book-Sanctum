import random
import gzip
import itertools
import json
def readData():
    readData = []
    with open('address.txt', 'r') as f:
        readData = f.readlines()

    data = []
    c = 0
    obj = {}
    for i in readData:
        li = ['AB', 'BC', 'MB', 'NB', 'NL','NT','NS','NU','ON','PE','QC','SK','YT']
        i = i.replace('\n', '')
        c+=1
        if(c==1):
            s = i.split(',')
            if(len(s)>1):

                obj["city"] = s[0]
                a = s[1].split(' ')

                obj["region"] = li[random.randint(0,len(li)-1)]
                obj["code"] = a[2]+a[3]
            else:
                obj["street"] = i
                obj["unit"] = random.randint(0,400)
                obj["phone"] = str(random.randint(100,999))+'-'+str(random.randint(100,999))+'-'+str(random.randint(1000,9999))
        if(c==2):
            s = i.split(',')
            if(len(s)>1):

                obj["city"] = s[0]
                a = s[1].split(' ')
                obj["region"] = li[random.randint(0,len(li)-1)]
                obj["code"] = a[2]+a[3]
            else:
                obj["street"] = i
                obj["unit"] = random.randint(0,400)
                obj["phone"] = str(random.randint(100,999))+'-'+str(random.randint(100,999))+'-'+str(random.randint(1000,9999))
                obj["country"] = "Canada"
            data.append(obj)
            c = 0
            obj = {}

    return data

def output_json(data,out):
    print("saving {} lines of json".format(len(data)))
    with open(out, 'w') as json_file:
        json.dump(data, json_file,indent=4, sort_keys=True )

def readJSON(file_name):
    address = readData()
    new_data = []

    with open(file_name) as f:
        data = json.load(f)
        start_size = len(data)

        for i in range(len(data)):
            data[i].update(address[i])
            del data[i]["address"]
            del data[i]["bank_id"]
            data[i]["rn"] = gen_random_range(9)
            data[i]["an"] = gen_random_range(10)
        for i in data:
            print(i)
        output_json(data, 'new_pub.json')

def gen_random_range(r):
    num = ''
    for i in range(r):
        num +=str(random.randint(0,9) )
    return num



readJSON('full_publishers.json')

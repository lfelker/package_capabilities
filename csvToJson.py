#!/usr/bin/python

import sys, getopt
import csv
import json

#Get Command Line Arguments
def main(argv):
    input_file = ''
    output_file = ''
    try:
        opts, args = getopt.getopt(argv, "hi:o:f:", ["ifile=", "ofile=", "format="])
    except getopt.GetoptError:
        print 'csvToJson.py -i <path to inputfile> -o <path to outputfile>'
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'csvToJson.py -i <path to inputfile> -o <path to outputfile>'
            sys.exit()
        elif opt in ("-i", "--ifile"):
            input_file = arg
        elif opt in ("-o", "--ofile"):
            output_file = arg
    read_csv(input_file, output_file)

#Read CSV File
def read_csv(file, json_file):
    csv_rows = []
    with open(file) as csvfile:
        reader = csv.DictReader(csvfile)
        title = reader.fieldnames
        for row in reader:
            csv_rows.extend([{title[i]:row[title[i]] for i in range(len(title))}])
        write_json(csv_rows, json_file)

#Convert csv data into json and write it
def write_json(data, json_file):
    #first add web mercator long lat json array
    for delivery_location in data:
        delivery_location['location'] = [delivery_location['Longitude'], delivery_location['Latitude']]
       
    with open(json_file, "w") as f:
        f.write(json.dumps(data, sort_keys=False, indent=4, separators=(',', ': '), encoding="utf-8", ensure_ascii=False))

if __name__ == "__main__":
   main(sys.argv[1:])
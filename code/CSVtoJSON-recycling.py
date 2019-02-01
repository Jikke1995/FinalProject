#!/usr/bin/env python
# Name: Jikke van den Ende
# Student number: 10787593
"""
This script converts a CSV file into a JSON file.
"""

import csv
import pandas as pd
import json

INPUT_CSV = "recycling-numbers.csv"
OUTPUT_JSON = "recycling-numbers.json"

def convert_into_json_file(data):
    """
    This writes a JSON file with given CSV data.
    """
    # Open an empty json file
    jsonfile = open(OUTPUT_JSON, 'w')

    # Write csv data into new json file
    out = json.dumps(data)
    jsonfile.write(out)

    return jsonfile

def select_data(file):
    """
    This function selects the data of interest from the csv file.
    """
    # Read csv file
    reader = csv.DictReader(file)
    data = []
    datapoint = {}
    # In this case, selects the amount of plastic waste per country
    for row in reader:
        datapoint['Year'] = row['ï»¿Management Pathway']
        datapoint['Generation'] = row['Generation']
        datapoint['Recycled'] = row['Recycled']
        datapoint['Composted'] = row['Composted']
        datapoint['Combustion with Energy Recovery'] = row['Combustion with Energy Recovery']
        datapoint['Landfilled'] = row['Landfilled']
        data.append(datapoint)
        datapoint = {}

    return data

if __name__ == "__main__":
    csv_file = open(INPUT_CSV)
    data = select_data(csv_file)
    jsonfile = convert_into_json_file(data)

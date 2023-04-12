#!./venv/bin/python

import csv
import json

from geojson import FeatureCollection, Feature, Point


def read_dataset():
    reader = csv.DictReader(open('data/wahlbezirke_flensburg.csv'))
    
    return reader


def main():
    d = read_dataset()
    fc = []

    crs = {
        'type': 'name',
        'properties': {
            'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'
        }
    }

    for o in d:
        point = Point((float(o['longitude']), float(o['latitude'])))
            
        properties = {
            'district': o['district'],
            'name': o['name'],
            'address': o['address'],
            'postal_code': o['postalcode'],
            'city': o['city']
        }

        fc.append(Feature(geometry=point, properties=properties))

        next(d)

    c = FeatureCollection(fc, crs=crs)

    with open('data/wahlbezirke_flensburg.geojson', 'w') as f:
        json.dump(c, f, ensure_ascii=False)


if __name__ == '__main__':
    main()

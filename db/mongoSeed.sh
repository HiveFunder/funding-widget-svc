#!/bin/bash
cd db;
mongoimport --host=localhost:27017 -d sdc -c campaigns --type csv --file ./largeData.csv --headerline
for name in pledge*.csv; do mongoimport --host=localhost:27017 -d sdc -c pledges --type csv --file ./$name --headerline; done

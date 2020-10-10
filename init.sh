#!/bin/bash

./wait-for-db -m postgres -c postgresql://user:pass@foodbudget-db:5432/foodbudget -t 1000000 
yarn setup
yarn start
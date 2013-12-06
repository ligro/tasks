#!/usr/bin/env python2.7
# -*- encoding: UTF-8 -*-

import argparse

import search
import task
import auth

parser = argparse.ArgumentParser(description='Index the database.')
parser.add_argument('--id', dest='id', help='process a specific id')

args = parser.parse_args()

T = task.Task()
offset = 0
limit = 50
while True:
    tasks = T.find({}, limit=limit, skip=offset)
    if len(tasks) == 0:
        break
    for task in tasks:
        search.index(tasks[task])
    print "index task from {} to {}".format(offset, limit)
    search.flush()

    offset += limit

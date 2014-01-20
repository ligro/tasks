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
    print "get tasks from {} to {}".format(offset, limit)
    tasks = T.find({}, limit=limit, skip=offset)
    if len(tasks) == 0:
        break
    print "index {} tasks".format(len(tasks))
    for task in tasks:
        if 'tags' in tasks[task]:
            tasks[task]['tag'] = tasks[task]['tags']
        search.index(tasks[task])
    search.flush()
    if len(tasks) < limit:
        break

    offset += limit


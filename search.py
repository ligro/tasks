# -*- encoding: UTF-8 -*-
import os
import xappy

import auth
from taskconfig import config

def index(task):
    doc = xappy.UnprocessedDocument()
    doc.fields.append(xappy.Field('id', task['_id']))
    doc.fields.append(xappy.Field('authorId', task['authorId']))
    doc.fields.append(xappy.Field('task', task['task']))
    if 'tags' in task:
        for tag in task['tags']:
            if len(tag):
                doc.fields.append(xappy.Field('tag', tag))

    _index.add_doc(doc)

def flush():
    _index.flush()

def query(query, limit, offset=0):
    _index._sconn.reopen()
    q = _index._sconn.query_parse(query, default_op=_index._sconn.OP_OR)
    if auth.userAuth is not None:
        fq = _index._sconn.query_field('authorId', auth.userAuth['_id'])
    q = _index._sconn.query_filter(q, fq)
    rows = _index._sconn.search(q, offset, limit)

    results = []
    for row in rows:
        results.append(row.data)
    return results

class Index:
    _sconn = None
    _iconn = None

    def __init__(self):
        if os.path.isdir(config['index']['path']):
            self.open_index(config['index']['path'])
        else:
            self.create_index(config['index']['path'])

    def __del__(self):
        if self._sconn:
            self._sconn.close()
        if self._iconn:
            self._iconn.flush()
            self._iconn.close()

    def create_index(self, dbpath):
        """Create a new index, and set up its field structure.
        """
        self._iconn = xappy.IndexerConnection(dbpath)

        self._iconn.add_field_action('id', xappy.FieldActions.INDEX_EXACT)
        self._iconn.add_field_action('id', xappy.FieldActions.STORE_CONTENT)
        self._iconn.add_field_action('authorId', xappy.FieldActions.INDEX_EXACT)

        self._iconn.add_field_action('tag', xappy.FieldActions.INDEX_EXACT)
        self._iconn.add_field_action('tag', xappy.FieldActions.STORE_CONTENT)
        # FIXME fatal error
        #self._iconn.add_field_action('tag', xappy.FieldActions.FACET, type='string')

        self._iconn.add_field_action('task', xappy.FieldActions.INDEX_FREETEXT, language='en')
        self._iconn.add_field_action('task', xappy.FieldActions.STORE_CONTENT)

        self._sconn = xappy.SearchConnection(dbpath)

    def open_index(self, dbpath):
        """Open an existing index. """
        self._sconn = xappy.SearchConnection(dbpath)
        self._iconn = xappy.IndexerConnection(dbpath)

    def flush(self):
        self._iconn.flush()

    def add_doc(self, doc):
        self._iconn.add(doc)

_index = Index()

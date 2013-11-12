import ConfigParser


cp = ConfigParser.ConfigParser()
cp.read('config.ini')

config = {
        'httpserver': {
            'host': '0.0.0.0',
            'port': 8080,
            },
        'database': {
            'host': None,
            'port': None,
            'db_name': 'task'
            },
        }


spec = {
        'httpserver': { 'port': 'getint' },
        'database': { 'port': 'getint' }
        }

for section in cp.sections():
    if section not in config:
        #warning
        continue
    for option in cp.options(section):
        if option not in config[section]:
            #warning
            continue

        import pprint
        if section in spec and option in spec[section]:
            method = spec[section][option]
        else:
            method = 'get'

        config[section][option] = getattr(cp, method)(section, option)
        # todo debug overwrite value


from model_mongo import Model

class UserMongo(Model):
    """user object"""
    def __init__(self):
        super(User, self).__init__()
        self.collection = self.db.user

    def _validate(self, datas):
        datas = super(User, self)._validate(datas)
        # todo
        return datas

class PasswordMongo(Model):
    def __init__(self):
        super(Password, self).__init__()
        self.collection = self.db.password

    def _validateOne(self, data):
        data = super(Password, self)._validateOne(data)
        data['password'] = self._encodePwd(data['password'])
        return data

    def findOne(self, specs):
        return self.findOne(specs)

    def _encodePwd(self, raw_pwd):
        import random

        algo = 'sha1'
        salt = ''.join(random.sample('abcdefghijklmnopqrstuvwxyz', 15))
        hsh = self._enc(algo, salt, raw_pwd)
        return '%s$%s$%s' % (algo, salt, hsh)

    def check_pwd(self, enc_pwd, raw_pwd):
        try:
            algo, salt, hsh = enc_pwd.split('$')
        except:
            return False

        return hsh == self._enc(algo, salt, raw_pwd)

    def _enc(self, algo, salt, pwd):
        import hashlib

        hl = hashlib.new(algo)
        hl.update('{0}{1}'.format(salt, pwd))
        return hl.hexdigest()


var Promise = require('es6-promise').Promise;

function Snag(params) {
  this.ghrepo = params.ghrepo;
  this.path = params.path || '';
}

Snag.prototype.contents = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    self.ghrepo.contents(self.path, function (err, body) {
      if (err) {
        reject(new Error('Can not retrieve files: ' + err.message));
      } else {
        var results = [];
        if (body && body.length) {
          body.forEach(function (file) {
            results.push(file);
          });
        }
        resolve(results);
      }
    });
  });

};

Snag.prototype.getFile = function (path) {
  var self = this;
  return new Promise(function (resolve, reject) {
    self.ghrepo.contents(path, function (err, body) {
      if (err) {
        reject(new Error('Can not retrieve file: ' + err.message));
      } else {
        if (body && body.encoding === 'base64') {
          body.content = new Buffer(body.content, 'base64').toString('utf8');
        }
        resolve(body);
      }
    });
  });
};

/**
 * Return a promise for an array of all files in path.
 */
Snag.prototype.getAllFiles = function () {
  var self = this,
    promises = [];

  return self.contents().then(function (fileList) {
    fileList.forEach(function (fileListItem) {
      promises.push(self.getFile(fileListItem.path));
    });
    return Promise.all(promises);
  });
};

exports.Snag = Snag;

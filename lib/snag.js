var Promise = require('es6-promise').Promise;

function Snag(params) {
  this.ghrepo = params.ghrepo;
  this.postPath = params.postPath || '';
}

Snag.prototype.contents = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    self.ghrepo.contents(self.postPath, function (err, body) {
      if (err) {
        reject(new Error('Can not retrieve posts: ' + err.message));
      } else {
        var results = [];
        if (body && body.length) {
          body.forEach(function (post) {
            results.push(post);
          });
        }
        resolve(results);
      }
    });
  });

};

Snag.prototype.getFile = function (postPath) {
  var self = this;
  return new Promise(function (resolve, reject) {
    self.ghrepo.contents(postPath, function (err, body) {
      if (err) {
        reject(new Error('Can not retrieve post: ' + err.message));
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
 * Return a promise for an array of all posts.
 */
Snag.prototype.getAllFiles = function () {
  var self = this,
    promises = [];

  return self.contents().then(function (postList) {
    postList.forEach(function (postListItem) {
      promises.push(self.getFile(postListItem.path));
    });
    return Promise.all(promises);
  });
};

exports.Snag = Snag;

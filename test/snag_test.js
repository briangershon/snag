/*globals describe, it */
var chai = require("chai"),
  chaiAsPromised = require("chai-as-promised"),
  expect = chai.expect;

chai.use(chaiAsPromised);

var Snag = require('../lib/snag.js').Snag;

/**
 * Pass in an err parameter to mock up an error.
 * Pass in a body parameter to mock up data coming back.
 * @param  {[type]} err  [description]
 * @param  {[type]} body [description]
 * @return {[type]}      [description]
 */
function mockContents(err, body) {
  return {
    contents: function (path, cb) {
      cb(err, body);
    }
  };
}

describe('Snag', function () {
  describe('defaults', function () {
    it('should have a postPath', function () {
      var snag = new Snag({ghrepo: mockContents(null, [])});
      expect(snag.postPath).to.equal('');
    });
  });

  describe('#listPosts', function () {
    it('should return an empty list if no results', function (done) {
      var snag = new Snag({ghrepo: mockContents(null, null)});
      expect(snag.contents()).to.eventually.become([]).and.notify(done);
    });

    it('should list all file names', function (done) {
      var snag = new Snag({ghrepo: mockContents(null, [{name: 'file.markdown'}])});
      expect(snag.contents()).to.eventually.become([{name: 'file.markdown'}]).and.notify(done);
    });

    it('should return a rejected promise if an error occurs', function (done) {
      var snag = new Snag({ghrepo: mockContents({message: 'some error'}, null)});
      expect(snag.contents()).to.eventually.be.rejectedWith('Can not retrieve posts: some error').and.notify(done);
    });
  });

  describe('#getFile', function () {
    it('should not change body.content if body.encoding !== "base64"', function (done) {
      var snag = new Snag({ghrepo: mockContents(null, {content: 'abc'})});
      expect(snag.getFile()).to.eventually.become({content: 'abc'}).and.notify(done);
    });

    it('should decode body.content if body.encoding === "base64"', function (done) {
      var snag = new Snag({ghrepo: mockContents(null, {encoding: 'base64', content: 'dGVzdAo='})});
      expect(snag.getFile()).to.eventually.become({encoding: 'base64', content: 'test\n'}).and.notify(done);
    });

    it('should not error even if body is null', function (done) {
      var snag = new Snag({ghrepo: mockContents(null, null)});
      expect(snag.getFile()).to.eventually.become(null).and.notify(done);
    });
  });
});
/**
 * This sample app loads up a GitHub repo full of text files.
 */

var github = require('octonode'),
  Snag = require('./lib/snag.js').Snag;

var envAccessToken = process.env.BITESIZE_GITHUB_ACCESS_TOKEN,
  envGitHubRepo = process.env.BITESIZE_BLOG_GITHUB_REPO,
  envPostPath = process.env.BITESIZE_BLOG_GITHUB_POST_PATH;

var client = github.client(envAccessToken);
var ghrepo = client.repo(envGitHubRepo);

var gh = new Snag({
  ghrepo: ghrepo,
  postPath: envPostPath
});

console.log('Retrieving files, then displaying their name and content:');

gh.getAllFiles().then(function (files) {
  files.forEach(function (file) {
    console.log(file.name, file.content);
  });
  console.log('Total files: ', files.length);
});
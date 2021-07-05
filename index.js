const express = require("express");
const simpleGit = require("simple-git");

function gitStaticFileServer() {
  return express();
}

module.exports = gitStaticFileServer;

if (require.main === module) {
  const app = gitStaticFileServer();
  app.listen(4000);
}

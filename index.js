#!/usr/bin/env node

const path = require("path");
const express = require("express");
const simpleGit = require("simple-git");

function gitStaticFileServer(simpleGitOptions) {
  const app = express();
  const git = simpleGit(simpleGitOptions);

  app.get("/:reference/*", async (req, res, next) => {
    try {
      const file = req.params[0];
      if (file.trim() === "") return next();
      res
        .type(path.extname(file))
        .send(await git.show([`${req.params.reference}:${file}`]));
    } catch (error) {
      if (
        error.message.match("invalid object name") ||
        error.message.match("does not exist in")
      )
        return next();
      next(error);
    }
  });

  return app;
}

module.exports = gitStaticFileServer;

if (require.main === module) {
  const baseDir = path.resolve(process.argv[2] ?? __dirname);
  const app = gitStaticFileServer({ baseDir });
  app.listen(4000, () => {
    console.log(`Git Static File Server running at port 4000, serving baseDir ${baseDir}`)
  });
}

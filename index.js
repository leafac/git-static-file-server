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
  const app = gitStaticFileServer({ baseDir: __dirname });
  app.listen(4000);
}

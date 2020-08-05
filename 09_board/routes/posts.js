var express = require("express");
var router = express.Router();

module.exports = function (db) {
  router
    .route("/")
    .all(function (req, res, next) {
      if (!req.session.loggedIn) {
        res.redirect("/logout");
      } else {
        next();
      }
    })
    .get(function (req, res, next) {
      db.getPostList(function (err, posts) {
        if (err) {
          res.render("error");
        } else {
          res.render("posts", {
            user: req.session.loggedIn,
            posts: posts,
          });
        }
      });
    });

  router
    .route("/create")
    .all(function (req, res, next) {
      if (!req.session.loggedIn) {
        res.redirect("/logout");
      } else {
        next();
      }
    })
    .get(function (req, res, next) {
      res.render("editPost", {
        user: req.session.loggedIn,
        action: "/posts/create",
        post: { title: "", contents: "" },
      });
    })
    .post(function (req, res, next) {
      const title = req.body.title;
      const contents = req.body.contents;
      db.insertPost([title, contents, req.session.loggedIn.id], function (
        err,
        result
      ) {
        if (err) {
          res.render("error");
        } else {
          res.redirect("/posts");
        }
      });
    });

  return router;
};

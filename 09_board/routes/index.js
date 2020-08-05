var express = require("express");
const db = require("../db");
var router = express.Router();

module.exports = function (connection) {
  router.get("/", function (req, res, next) {
    res.render("home", { user: req.session.loggedIn });
  });

  router
    .route("/login")
    .get(function (req, res, next) {
      res.render("login", { error: false, user: req.session.loggedIn });
    })
    .post(function (req, res, next) {
      const email = req.body.email;
      const password = req.body.password;
      db.getLoginUser([email, password], function (err, users) {
        if (err) {
          console.log(err);
          res.render("error");
        } else if (users.length > 0) {
          req.session.loggedIn = users[0];
          res.redirect("/");
        } else {
          res.render("login", { error: true, user: req.session.loggedIn });
        }
      });
    });

  router.route("/signup").get(function (req, res, next) {
    res.render("signup", { errorMessage: null, user: req.session.loggedIn });
  })
  .post(function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    var age = null;
    if (req.body.age) {
      age = req.body.age;
    }
    db.getUserByEmail(
      [email],
      function (err, users) {
        //오류발생
        if (err) {
          res.render("signup", {
            errorMessage: "오류발생",
            user: req.session.loggedIn,
          }); //서버상의 오류가 발생할 때 나타남
        } else if (users.length > 0) {
          //ex)서버에 접근할 수 없거나 테이블이 없을 경우
          res.render("signup", {
            errorMessage: "이미 존재하는 이메일",
            user: req.session.loggedIn,
          }); //아이디가 중복될 경우
        } else {
          //이메일이 users table에 없을 경우
          db.insertUser(
            [email, password, age],
            function (err2, result) {
              if (err2) {
                res.render("signup", {
                  errorMessage: "생성오류",
                  user: req.session.loggedIn,
                }); //서버상의 오류가 발생할 때 나타남
              } else {
                //insert 성공
                res.render("login", {
                  error: false,
                  user: req.session.loggedIn,
                });
              }
            }
          );
        }
      }
    );

  router.route("/logout").get(function (req, res, next) {
    if (req.session.loggedIn) {
      req.session.destroy(function (err) {
        if (err) {
          console.log(err);
          res.render("error");
        } else {
          res.redirect("/");
        }
      });
    } else {
      res.redirect("/");
    }
  });

  router.route("/list").get(function (req, res, next) {
    db.getUserList(function (err, rows) {
      if (err) {
        console.log(err);
        res.render("error");
      }
      res.render("list", { users: rows, user: req.session.loggedIn });
    });
  });

  return router;
};

var http = require("http");
var express = require("express");
var app = express();
var path = require("path");
var server = http.createServer(app);
var port = 3333;
var session = require("express-session");
require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

var mysql = require("mysql2");
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

var db = require("../db")(connection);

var indexRouter = require("./routes/index")(db);
app.use("/", indexRouter);

var postsRouter = require("./routes/posts")(db);
app.use("/posts", postsRouter);

var postRouter = require("./routes/post")(db);
app.use("/post", postRouter);

// app.get('/', function(req, res){
//     res.render('home', {user: req.session.loggedIn});
// });

// app.get("/board", function (req, res) {
//   res.render("board", { user: req.session.loggedIn });
// });

// app.get("/logout", function (req, res) {
//   if (req.session.loggedIn) {
//     req.session.destroy(function (err) {
//       if (err) {
//         console.log(err);
//         res.render("error");
//       } else {
//         res.redirect("/");
//       }
//     });
//   } else {
//     res.redirect("/");
//   }
// });

// app.get('/login', function(req, res){
//     res.render('login', {error: false, user: req.session.loggedIn});
// });

// app.get("/signup", function (req, res) {
//   res.render("signup", { errorMessage: null, user: req.session.loggedIn });
// });

// app.post("/signup", function (req, res) {
//   const email = req.body.email;
//   const password = req.body.password;
//   var age = null;
//   if (req.body.age) {
//     age = req.body.age;
//   }
//   connection.query(
//     `SELECT id from users WHERE email=?`, //email이 같은 user의 id 찾기
//     [email],
//     function (err, users) {
//       //오류발생
//       if (err) {
//         res.render("signup", {
//           errorMessage: "오류발생",
//           user: req.session.loggedIn,
//         }); //서버상의 오류가 발생할 때 나타남
//       } else if (users.length > 0) {
//         //ex)서버에 접근할 수 없거나 테이블이 없을 경우
//         res.render("signup", {
//           errorMessage: "이미 존재하는 이메일",
//           user: req.session.loggedIn,
//         }); //아이디가 중복될 경우
//       } else {
//         //이메일이 users table에 없을 경우
//         connection.query(
//           `INSERT INTO users (email, password, age)
//                             VALUES (?, ?, ?)`,
//           [email, password, age],
//           function (err2, result) {
//             if (err2) {
//               res.render("signup", {
//                 errorMessage: "생성오류",
//                 user: req.session.loggedIn,
//               }); //서버상의 오류가 발생할 때 나타남
//             } else {
//               //insert 성공
//               res.render("login", { error: false, user: req.session.loggedIn });
//             }
//           }
//         );
//       }
//     }
//   );
// });

// app.post('/login', function(req, res){
//     const email = req.body.email;
//     const password = req.body.password;
//     connection.query(
//         "SELECT * from users WHERE email=? and password=?",
//         [email, password],
//         function(err, users){
//             if(err){
//                 console.log(err);
//                 res.render('error');
//             } else if (users.length > 0) {
//                 req.session.loggedIn = users[0];
//                 res.redirect('/');
//             } else {
//                 res.render('login', {error:true, user: req.session.loggedIn});
//             }
//         }
//     )
// })

// app.get("/list", function (req, res) {
//   connection.query("SELECT * from users", function (err, rows) {
//     if (err) {
//       console.log(err);
//       res.render("error");
//     }
//     res.render("list", { users: rows, user: req.session.loggedIn });
//   });
// });

// app.get("/posts", function (req, res) {
//   if (!req.session.loggedIn) {
//     res.redirect("/logout");
//   } else {
//     connection.query(
//       `
//         select p.post_id, p.title, u.email, p.user_id, p.view_count, p.likes, count(c.post_id) as comment_count
//         from posts as p
//         left join users as u
//         on p.user_id = u.id
//         left join comments as c
//         on c.post_id = p.post_id
//         group by c.post_id, p.post_id
//         order by p.post_id asc;
//         `,
//       function (err, posts) {
//         if (err) {
//           res.render("error");
//         } else {
//           res.render("posts", {
//             user: req.session.loggedIn,
//             posts: posts,
//           });
//         }
//       }
//     );
//   }
// });

// app.get("/post/:postId", function (req, res) {
//   if (!req.session.loggedIn) {
//     res.redirect("/loggedIn");
//   } else {
//     const postId = req.params.postId;
//     connection.query(
//       `
//             select post_id, title, contents, email, user_id, view_count from posts
//                 left join users
//                 on user_id = users.id
//                  where post_id = ?
//             `,
//       [postId],
//       function (err, posts) {
//         if (err) {
//           res.render("error");
//         } else if (posts.length < 1) {
//           console.log("post가 없음");
//           res.render("error");
//         } else {
//           connection.query(
//             `select comment_id, contents, user_id, email from comments
//                         left join users
//                         on user_id = users.id
//                         where post_id = ?
//                         order by comment_id desc`,
//             [postId],
//             function (err, comments) {
//               if (err) {
//                 res.render("error");
//               } else {
//                 const target = posts[0];
//                 if (target.user_id == req.session.loggedIn.id) {
//                   res.render("post", {
//                     user: req.session.loggedIn,
//                     post: posts[0],
//                     comments: comments,
//                   });
//                 } else {
//                   connection.query(
//                     `update posts set
//                             view_count=? where post_id=?`,
//                     [target.view_count + 1, postId],
//                     function (err, result) {
//                       if (err) {
//                         res.render("error");
//                       } else {
//                         res.render("post", {
//                           user: req.session.loggedIn,
//                           post: posts[0],
//                           comments: comments,
//                         });
//                       }
//                     }
//                   );
//                 }
//               }
//             }
//           );
//         }
//       }
//     );
//   }
// });

// app.get("/post/delete/:postId", function (req, res) {
//   if (!req.session.loggedIn) {
//     res.redirect("/logout");
//   } else {
//     const postId = Number(req.params.postId);
//     connection.query(`delete from posts where post_id = ?`, [postId], function (
//       err,
//       result
//     ) {
//       if (err) {
//         console.log(err);
//         res.render("error");
//       } else {
//         res.redirect("/posts");
//       }
//     });
//   }
// });

// app.get("/posts/create", function (req, res) {
//   if (!req.session.loggedIn) {
//     res.redirect("logout");
//   } else {
//     res.render("editPost", {
//       user: req.session.loggedIn,
//       action: "/posts/create",
//       post: { title: "", contents: "" },
//     });
//   }
// });

// app.post("/posts/create", function (req, res) {
//   if (!req.session.loggedIn) {
//     res.redirect("/logout");
//   } else {
//     const title = req.body.title;
//     const contents = req.body.contents;
//     connection.query(
//       `insert into posts (title, contents, user_id)
//             values (?, ?, ?)`,
//       [title, contents, req.session.loggedIn.id],
//       function (err, result) {
//         if (err) {
//           res.render("error");
//         } else {
//           res.redirect("/posts");
//         }
//       }
//     );
//   }
// });

// app.get("/post/edit/:postId", function (req, res) {
//   if (!req.session.loggedIn) {
//     res.redirect("logout");
//   } else {
//     const postId = req.params.postId;
//     connection.query(
//       `select * from posts
//             where user_id = ? and post_id = ?`,
//       [req.session.loggedIn.id, postId],
//       function (err, rows) {
//         if (err) {
//           console.log(err);
//           res.render("error");
//         } else if (rows.length < 1) {
//           res.render("error");
//         } else {
//           res.render("editPost", {
//             user: req.session.loggedIn,
//             post: rows[0],
//             action: "/post/edit/" + postId,
//           });
//         }
//       }
//     );
//   }
// });

// app.post("/post/edit/:postId", function (req, res) {
//   if (!req.session.loggedIn) {
//     res.redirect("error");
//   } else {
//     const postId = req.params.postId;
//     const title = req.body.title;
//     const contents = req.body.contents;
//     connection.query(
//       `update posts set title=?, contents=? where post_id=?`,
//       [title, contents, postId],
//       function (err, result) {
//         if (err) {
//           res.render("error");
//         } else {
//           res.redirect("/posts");
//         }
//       }
//     );
//   }
// });
// //누구의 글을 좋아요 하는지 알기 위해 postId 필요함
// app.get("/post/like/:postId", function (req, res) {
//   if (!req.session.loggedIn) {
//     res.redirect("error");
//   } else {
//     const postId = req.params.postId;
//     connection.query(
//       `select likes from posts where post_id=?`,
//       [postId],
//       function (err, posts) {
//         if (err) {
//           res.render("error");
//         } else if (posts.length < 1) {
//           res.render("error");
//         } else {
//           const target = posts[0];
//           connection.query(
//             `update posts set likes=? where post_id=?`,
//             [target.likes + 1, postId],
//             function (err, result) {
//               if (err) {
//                 res.render("error");
//               } else {
//                 res.redirect("/posts");
//               }
//             }
//           );
//         }
//       }
//     );
//   }
// });

// app.post("/comment/:postId", function (req, res) {
//   if (!req.session.loggedIn) {
//     res.render("error");
//   } else {
//     const postId = req.params.postId;
//     const contents = req.body.contents;
//     connection.query(
//       `insert into comments (contents, user_id, post_id) values (?,?,?)`,
//       [contents, req.session.loggedIn.id, postId],
//       function (err, result) {
//         if (err) {
//           console.log(err);
//           res.render("error");
//         } else {
//           res.redirect("/post/" + postId);
//         }
//       }
//     );
//   }
// });

// app.get("/comment/delete/:postId", function (req, res) {
//   if (!req.session.loggedIn) {
//     res.render("error");
//   } else {
//     const commentId = req.params.comment_id;
//     const contents = req.body.contents;
//     connection.query(
//       `delete from comments where comment_id = ?`,
//       [contents, req.session.loggedIn.id, postId],
//       function (err, result) {
//         if (err) {
//           console.log(err);
//           res.render("error");
//         } else {
//           res.redirect("/post/" + postId);
//         }
//       }
//     );
//   }
// });
server.listen(port, function () {
  console.log("웹 서버 시작", port);
});

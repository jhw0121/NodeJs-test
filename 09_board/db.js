module.exports = function (connection) {
  var sendQuery = function (query, callback, params = null) {
    connection.query(query, params, function (err, result) {
      if (err) return callback(err);
      callback(null, result);
    });
  };

  return {
    //index.js
    getUserList: function (callback) {
      sendQuery("SELECT * FROM users", callback);
    },
    getLoginUser: function (params, callback) {
      sendQuery(
        "SELECT * from users WHERE email=? and password=?",
        callback,
        params
      );
    },
    getUserbyEmail: function (params, callback) {
      sendQuery("SELECT id from users WHERE email=?", callback, params);
    },
    insertUser: function (params, callback) {
      sendQuery(
        `insert into posts (title, contents, user_id)
              values (?, ?, ?)`,
        callback,
        params
      );
    },
    //posts.js
    getPostList: function (callback) {
      sendQuery(
        `select p.post_id, p.title, u.email, p.user_id, p.view_count, p.likes, count(c.post_id) as comment_count
        from posts as p
        left join users as u
        on p.user_id = u.id
        left join comments as c
        on c.post_id = p.post_id
        group by c.post_id, p.post_id
        order by p.post_id asc;`,
        callback
      );
    },
    insertPost: function (params, callback) {
      sendQuery(
        `insert into posts (title, contents, user_id)
            values (?, ?, ?)`,
        callback,
        params
      );
    },
    //post.js
    getPost: function (params, callback) {
      sendQuery(
        `
            select post_id, title, contents, email, user_id, view_count from posts
                left join users
                on user_id = users.id
                 where post_id = ?
            `,
        callback,
        params
      );
    },

    //comment.js
    insertComment: function (params, callback) {
      sendQuery(
        `insert into comments (contents, user_id, post_id) values (?,?,?)`,
        callback,
        params
      );
    },
  };
};

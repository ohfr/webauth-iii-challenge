const bcrypt = require("bcryptjs");

exports.seed = function(knex) {
  return knex('user').truncate()
    .then(function () {
      return knex('user').insert([
        {username: "dan", password: bcrypt.hashSync("password", 12), department: "Sales"},
        {username: "example", password: bcrypt.hashSync("password", 12), department: "Sales"},
      ]);
    });
};
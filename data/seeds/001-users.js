
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').insert([
    {username: 'Boltsnut24', password: 'password1'},
    {username: 'BradPeterson', password: 'password2'},
    {username: 'PupperDog', password: 'password3'},
  ]);

};
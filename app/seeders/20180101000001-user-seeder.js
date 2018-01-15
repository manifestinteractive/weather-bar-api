module.exports = {
  up: function (queryInterface) {
    return queryInterface.bulkInsert('users', [
      {
        activated: true,
        username: 'admin',
        password: '$2a$08$OVrWutoBCqIH2MB6HFyrguwBjy5V8oGR8pUagTsxa5ZBTkXIk2rkG',
        email: 'hello@weatherbar.com',
        first_name: 'Weather Bar',
        last_name: 'Weather Bar',
        company_name: 'Weather Bar',
        profile_name: 'Weather Bar',
        profile_photo: null,
        location: 'United States',
        profile_link_website: 'https://weatherbarapp.com',
        bio: null,
        created_date: new Date(),
        modified_date: new Date()
      }
    ], {
      updateOnDuplicate: ['activated', 'username', 'password', 'email', 'first_name', 'last_name', 'company_name', 'profile_name', 'profile_photo', 'location', 'profile_link_website', 'bio', 'modified_date']
    }).catch(function (err) {
      if (err && err.errors) {
        for (var i = 0; i < err.errors.length; i++) {
          console.error('× SEED ERROR', err.errors[i].type, err.errors[i].message, err.errors[i].path, err.errors[i].value);
        }
      } else if (err && err.message) {
        console.error('× SEED ERROR', err.message);
      }
    });
  },
  down: function (queryInterface) {
    return queryInterface.bulkDelete('users', null, {});
  }
};

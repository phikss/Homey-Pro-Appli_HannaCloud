'use strict';

module.exports = {

  // Correspond à la route "testLogin" définie dans app.json
  async testLogin({ homey }) {
    return homey.app.testLogin();
  },

};

const fetch = require("node-fetch");
const secret = require('./secret.json');

module.exports = { 
    fetchHacknPlan : function (url, method) {
    return fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'ApiKey ' + secret.hacknplan_api_key
            }
      });
    },

    postHacknPlan : function (url, method, bodyContent) {
        return fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `ApiKey ${secret.hacknplan_api_key}`
                },
            body: bodyContent,
          });
    }
}
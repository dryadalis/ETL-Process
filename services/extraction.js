const rp = require('request-promise');

 module.exports = {
  perform: function (uri) {
      const options = {
          uri
      };

      promise = rp(options)
        .then(function(body) {
            return body;
    });
    return promise;
  }
};

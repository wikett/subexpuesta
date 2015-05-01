'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            //'mongodb://LeObfHNJpuhT:XKvZYlPNmMHw@mongosoup-cont002.mongosoup.de:32421/cc_LeObfHNJpuhT'
            'mongodb://superadmin:poiuasdf77@ds037601.mongolab.com:37601/heroku_app35451627'
            
  }
};
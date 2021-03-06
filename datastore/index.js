const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile((exports.dataDir + `/${id}.txt`), text, (err) => {
      if (err) {
        throw ('error');
      } else {
        callback(null, { text, id });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error');
    } else {
      var data = _.map(files, (file) => {
        return new Promise ((resolve, reject) => {
          var fileName = file.split('.')[0];
          exports.readOne(fileName, (err, text) => {
            if (err) {
              reject(err);
            } else {
              console.log('hellllooo', {id: text.id, text: text.text});
              resolve({id: text.id, text: text.text});
            }
          });
        });
      });
      Promise.all(data);
      // .then()
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile((exports.dataDir + `/${id}.txt`), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: data.toString('utf8') });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.access((exports.dataDir + `/${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile((exports.dataDir + `/${id}.txt`), text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.access((exports.dataDir + `/${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`No Item with id: ${id}`));
    } else {
      fs.unlink((exports.dataDir + `/${id}.txt`), (err) => {
        if (err) {
          callback(new Error(`No Item with id: ${id}`));
        } else {
          callback(null, { id });
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

/**
 * Autor Eugene Demchenko <demchenkoev@gmail.com>
 * Created on 13.02.15.
 * License MIT
 */

'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var ejs = require('ejs-locals');

module.exports = function (options, settings) {

  settings = settings || {};
  options = options || {};
  settings.ext = typeof settings.ext === "undefined" ? ".html" : settings.ext;
  options.settings = settings;

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit(
        'error',
        new gutil.PluginError('gulp-ejs-locals', 'Streaming not supported')
      );
    }
    var $this = this;
    options.filename = file.path;
    try {
      ejs(file, options, function(err, html) {
        if(err) return $this.emit('error', new gutil.PluginError('gulp-ejs-locals', err.toString()));

        file.contents = new Buffer(html);
        file.path = gutil.replaceExtension(file.path, settings.ext);

        $this.push(file);
        cb();

      });
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-ejs', err.toString()));
      cb();
    }
  });
}
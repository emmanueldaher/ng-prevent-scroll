'use strict';

var gulp = require('gulp');
var path = require('path');
var conf = require('./conf');
var GulpSSH = require('gulp-ssh');
var packageFile = require('../package.json');

var sshConfig = {
    host: 'validacao-dsp',
    user: 'front',
    password: 'front'
};

var remotePath = `/opt/front/apps/${packageFile.name}-${packageFile.version}`;

gulp.task('clean:val', function(){
    var gulpSSH = new GulpSSH({
        ignoreErrors: false,
        sshConfig: sshConfig
    });

    return gulpSSH.shell([
        `cd ${remotePath}`,
        `rm -rf scripts/*.js`,
        `rm -rf styles/*.css`
    ]);
});

gulp.task('publish:val', ['build', 'clean:val'], function() {
    var gulpSSH = new GulpSSH({
        ignoreErrors: false,
        sshConfig: sshConfig
    });

    return gulp.src(path.join(conf.paths.dist, '/**/*'))
        .pipe(gulpSSH.dest(remotePath));
});

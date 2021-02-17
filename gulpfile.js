const gulp = require('gulp');
const sass = require('gulp-sass');
const cssmin = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

const forms_folders = [
  {
    name: 'login',
    path: './public/style/src/forms/login.scss'
  },
  {
    name: 'register',
    path: './public/style/src/forms/register.scss'
  },
  {
    name: 'reset_password',
    path: './public/style/src/forms/reset_password.scss'
  },
  {
    name: 'forgot_password',
    path: './public/style/src/forms/forgot_password.scss'
  }
]
gulp.task('workflow', function(done){
  forms_folders.forEach(folder => {
    gulp.src(folder.path, { base: `./public/style/src/forms/`})
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('./public/style/dist'))

    done();
  });
});
gulp.task('default', function(done){
  gulp.watch('./public/style/src/**/*.scss', gulp.series('workflow'));

  done();
});
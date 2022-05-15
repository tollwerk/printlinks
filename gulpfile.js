const gulp = require('gulp');
const typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const inject = require('gulp-inject');
const path = require('path');

gulp.task('js', function () {
    return gulp.src('src/*.js')
        .pipe(inject(gulp.src(['./node_modules/qrcode-svg/lib/qrcode.js']), {
            starttag: '/* inject:{{ext}} */',
            endtag: '/* endinject */',
            transform: function (filePath, file) {
                return file.contents.toString('utf8')
            }
        }))
        .pipe(typescript({ target: 'ES5', allowJs: true }))
        .pipe(uglify())
        .pipe(rename(path => path.basename += '.min'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('html', function () {
    return gulp.src('src/index.html')
        .pipe(inject(gulp.src(['./dist/*.js']), {
            starttag: '<!-- inject:bookmarklet -->',
            transform: function (filePath, file) {
                const code = file.contents.toString('utf8').replace(/^!(.*)(\(.*?\));?$/g, function (match, b, c) {
                    return `(${b})${c};printlinks()`;
                });
                return `<li><a href="javascript:${encodeURI(code)}">Printable Link Directory</a></li>`;
            }
        }))
        .pipe(gulp.dest('./docs'));
});

// Register Gulp watch task
gulp.task('watch', function () {
    gulp.watch('src/*.js', gulp.series(['js', 'html']));
});

// Register Gulp default task
gulp.task('default', gulp.series(['js', 'html']));

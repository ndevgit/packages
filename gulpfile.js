import gulp from "gulp";
import browserSync from "browser-sync";
const browserSyncCreate = browserSync.create();
import dartSass from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(dartSass);
import rename from "gulp-rename";
import autoprefixer from "gulp-autoprefixer";
import imagemin from "gulp-imagemin";
import gulpChanged from "gulp-changed";
import webpackStream from "webpack-stream";
import webpackConfig from "./webpack.config.js";

// Static server
gulp.task("browserSync", function () {
  browserSyncCreate.init({
    server: {
      baseDir: "src",
    },
  });
});

gulp.task("gulpSass", function () {
  return gulp
    .src("src/styles/sass/*.+(scss|sass)")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(
      rename({
        prefix: "",
        suffix: ".min",
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulp.dest("src/styles/css"))
    .pipe(gulp.dest("docs/styles/css"))
    .pipe(browserSyncCreate.stream());
});

gulp.task("htmlToDocs", function () {
  return gulp
    .src("src/*.html")

    .pipe(gulp.dest("docs"));
});

gulp.task("imagesToDocs", function () {
  return gulp.src("src/images/**/*").pipe(gulp.dest("docs/images"));
});

gulp.task("gulpImagemin", function () {
  return gulp
    .src("docs/images/**/*")
    .pipe(gulpChanged("docs/images"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("docs/images"));
});

gulp.task("jsToDocs", function () {
  return gulp.src("src/js/**/*").pipe(gulp.dest("docs/js"));
});

gulp.task("webpackStream", function () {
  return gulp
    .src("src/js/**/*")
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest("docs/js"));
});

gulp.task("watch", function () {
  gulp.watch("src/styles/sass/**/*.+(scss|sass)", gulp.parallel("gulpSass"));

  gulp.watch("src/*.html").on("change", browserSyncCreate.reload);

  gulp.watch("src/*.html", gulp.parallel("htmlToDocs"));

  gulp.watch("src/images/**/*", gulp.parallel("imagesToDocs"));

  gulp.watch("src/js/**/*", gulp.parallel("jsToDocs"));

  gulp.watch("src/js/**/*", gulp.parallel("webpackStream"));
});

gulp.task(
  "default",
  gulp.parallel(
    "watch",
    "browserSync",
    "gulpSass",
    "htmlToDocs",
    "imagesToDocs",
    "gulpImagemin",
    "jsToDocs",
    "webpackStream"
  )
);

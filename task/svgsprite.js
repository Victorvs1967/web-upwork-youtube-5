import sprite from 'gulp-svg-sprite';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';

import { src, dest } from '../gulpfile.js';
import path from '../config/path.js';
import app from '../config/app.js';

const svgSprite = () =>
  src(path.img.icons)
  .pipe(plumber({
    errorHandler: notify.onError(error => ({
      title: 'SVG',
      message: error.message,
    }))
  }))
  .pipe(sprite(app.svg))
  .pipe(dest(path.img.dest));

export default svgSprite;
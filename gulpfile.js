import gulp from 'gulp';
import browserSync from 'browser-sync';

import pug from './task/pug.js';
import styles from './task/styles.js';
import scripts from './task/scripts.js';
import image from './task/image.js';
import svgSprite from './task/svgsprite.js';
import font, { fontsStyle } from './task/font.js';
import clear from './task/clear.js';
import path from './config/path.js';
import app from './config/app.js';

export { src, dest, clear, styles, scripts, pug, font, image };

const { src, dest, watch, series, parallel } = gulp;
const browsersync = browserSync.create();

const watcher = () => {
  watch(path.pug.watch, pug).on('all', browsersync.reload);
  watch(path.sass.watch, styles).on('all', browsersync.reload);
  watch(path.js.watch, scripts).on('all', browsersync.reload);
  watch(path.img.watch, image).on('all', browsersync.reload);
};

const server = () =>
  browsersync.init({
    server: {
      baseDir: path.root,
    }
  });

export const fonts = series(font, fontsStyle);

export const build = series(
  clear,
  parallel(fonts, svgSprite, image),
  parallel(styles, scripts, pug),
);

export const dev = series(
  build,
  parallel(watcher, server)
);

export default app.isProd ? build : dev;
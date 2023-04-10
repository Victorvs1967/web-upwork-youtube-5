import fs from 'fs';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import newer from 'gulp-newer';
import fonter from 'gulp-fonter-2';
import ttf2woff2 from 'gulp-ttf2woff2';
import ttf2woff from 'gulp-ttf2woff';

import { src, dest } from '../gulpfile.js';
import path from '../config/path.js';
import app from '../config/app.js';

const font = () =>
  src(path.font.src)
    .pipe(plumber({
      errorHandler: notify.onError(error => ({
        title: "Font",
        message: error.message,
      })),
    }))
    .pipe(newer(path.font.dest))
    .pipe(fonter(app.fonter))
    .pipe(ttf2woff({clone: true}))
    .pipe(ttf2woff2({ clone: true }))
    .pipe(dest(path.font.dest));

export const fontsStyle = async () => {
  const cb = () => { };
  const fontsFile = path.src.concat('/sass/include/_fonts.sass');
  fs.readdir(path.root.concat('/font/'), (err, fontsFiles) => {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        for (let i = 0; i < fontsFiles.length; i++) {
          const fontFileName = fontsFiles[i].split('.')[0];
          if (newFileOnly !== fontFileName) {
            const fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
            let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
            let fontStyle = fontWeight.toLowerCase().includes('italic') ? 'italic' : 'normal';
            if (fontWeight.toLowerCase() == 'thin') {
              fontWeight = 100;
            } else if (fontWeight.toLowerCase() == 'extralight') {
              fontWeight = 200;
            } else if (fontWeight.toLowerCase() == 'light') {
              fontWeight = 300;
            } else if (fontWeight.toLowerCase() == 'medium') {
              fontWeight = 500;
            } else if (fontWeight.toLowerCase() == 'semibold') {
              fontWeight = 600;
            } else if (fontWeight.toLowerCase() == 'bold') {
              fontWeight = 700;
            } else if (fontWeight.toLowerCase() == 'extrabold') {
              fontWeight = 800;
            } else if (fontWeight.toLowerCase() == 'black') {
              fontWeight = 900;
            } else {
              fontWeight = 400;
            }
            fs.appendFile(fontsFile,
              `@font-face\n\tfont-family: ${fontName}\n\tfont-display: swap\n\tsrc: url("../font/${fontFileName}.woff2") format("woff2"), url("../font/${fontFileName}.woff") format("woff")\n\tfont-weight: ${fontWeight}\n\tfont-style: ${fontStyle}\n\r\n`, cb);
            newFileOnly = fontFileName;
          }
        }
      } else {
        console.log('file sass/includes/_fonts.sass already exist...');
      }
    }
  });
  return dest(path.src);
};

export default font;
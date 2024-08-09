import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { error } from 'console';
import fs from 'fs';
import { diskStorage } from 'multer';
import path, { join } from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  getRootPath = () => {
    return process.cwd();
  };

  ensureExists = (targetDirectory: string) => {
    fs.mkdir(targetDirectory, { recursive: true }, (error) => {
      if (!error) {
        console.log('Directory is already created !!!');
        return;
      }
      switch (error.code) {
        case 'EEXIST':
          console.log('Directory is already created !!!');
          break;
        case 'EACCES':
          console.log('Permission denied');
          break;
        default:
          console.log('Error creating directory: ' + error);
          break;
      }
    });
  };

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req?.headers?.folder_type ?? 'default';
          this.ensureExists(`public/images/${folder}`);
          cb(null, join(this.getRootPath(), `public/images/${folder}`));
        },
        filename(req, file, callback) {
          // get image extension
          let extName = path.extname(file.originalname);

          // get image name
          let baseName = path.basename(file.originalname, extName);

          let finalName = `${baseName}-${Date.now()}${extName}`;
          callback(null, finalName);
        },
      }),
    };
  }
}
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as  multer from 'multer';
import cloudinary from './cloudinaryConfig';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'uploads',
      format: file.mimetype.split('/')[1], // to dynamically get format from mimetype
      public_id: file.originalname.split('.')[0], // to use original name without extension as public ID
    };
  },
});

const upload = multer({ storage: storage });

export default upload;

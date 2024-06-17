import * as express from 'express';
import upload from '../configuration/multerConfig';
import Checklist from '../models/ChecklistModel'; // Adjust the import according to your project structure

const router = express.Router();

// Upload endpoint
router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const urls = files.map(file => file.path);
    res.json({ message: 'Files uploaded successfully', urls });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files', error });
  }
});

// Endpoint to add images to a checklist item
router.post('/checklist/:id/add-images', upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];
    const urls = files.map(file => file.path);

    const checklist = await Checklist.findById(id);
    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    checklist.items.forEach(item => {
      item.image = item.image.concat(urls);
    });

    await checklist.save();
    res.json({ message: 'Images added successfully', checklist });
  } catch (error) {
    res.status(500).json({ message: 'Error adding images to checklist', error });
  }
});

export default router;

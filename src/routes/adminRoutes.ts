import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { Container } from 'typedi';
import { checkJWT, checkAdmin } from '../middleware/auth.middleware';

const router = Router();
const adminController = Container.get(AdminController);

// router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.patch('/update/:id', [checkJWT, checkAdmin], adminController.updateAdmin);
router.delete('/delete/:id', [checkJWT, checkAdmin], adminController.deleteAdmin);

export { router as AdminRoutes };

import { Router } from 'express';
import { UserRoleController } from '../controllers/userRoleController';
import { Container } from 'typedi';
import { checkJWT, checkAdmin } from '../middleware/auth.middleware';

const router = Router();
const userRoleController = Container.get(UserRoleController);

router.post('/create', [checkJWT, checkAdmin], userRoleController.createUserRole);
router.patch('/update/:id', [checkJWT, checkAdmin], userRoleController.updateUserRole);
router.delete('/delete/:id', [checkJWT, checkAdmin], userRoleController.deleteUserRole);

export { router as UserRoleRoutes };

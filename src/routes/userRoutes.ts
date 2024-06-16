import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { Container } from 'typedi';
import { checkJWT, checkAdmin } from '../middleware/auth.middleware';

const router = Router();
const userController = Container.get(UserController);

router.post('/register', userController.save); 
router.post('/login', (req, res) => userController.loginUser(req, res));
router.patch('/:id', [checkJWT, checkAdmin], userController.updateUser);
router.delete('/:id', [checkJWT, checkAdmin], userController.deleteUser);
router.get('/:id', checkJWT, userController.findUserById);

export { router as UserRoutes };

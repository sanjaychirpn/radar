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
router.patch('/update/:id', [checkJWT], userController.updateUserFCM);

router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/:id', checkJWT, (req, res) => userController.findUserById(req, res));

router.get('/proctors/:id', (req, res) => userController.getAllProctorsByExamCenterId(req, res));
router.get('/supervisor/:id', (req, res) => userController.getAllSupervisorsByExamCenterId(req, res));

export { router as UserRoutes };

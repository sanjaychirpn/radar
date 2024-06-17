import { Router } from 'express';
import { ExamCenterController } from '../controllers/examCenterController';
import { Container } from 'typedi';
import { checkJWT, checkAdmin } from '../middleware/auth.middleware';

const router = Router();
const examCenterController = Container.get(ExamCenterController);

router.post('/', [checkJWT, checkAdmin], (req, res) => examCenterController.saveExamCenter(req, res));
router.get('/:id', checkJWT, (req, res) => examCenterController.findExamCenterById(req, res));
router.patch('/:id', [checkJWT, checkAdmin], (req, res) => examCenterController.updateExamCenter(req, res));
router.delete('/:id', [checkJWT, checkAdmin], (req, res) => examCenterController.deleteExamCenter(req, res));
router.post('/assign', [checkJWT, checkAdmin], (req, res) => examCenterController.assignUsersToExamCenter(req, res));

router.get('/', (req, res) => examCenterController.getAllExamCenters(req, res));

export { router as ExamCenterRoutes };

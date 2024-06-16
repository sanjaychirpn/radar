import { Router } from 'express';
import { ChecklistController } from '../controllers/checklistController';
import { Container } from 'typedi';
import { checkJWT, checkAdmin } from '../middleware/auth.middleware';

const router = Router();
const checklistController = Container.get(ChecklistController);

router.post('/create', [checkJWT, checkAdmin], checklistController.createChecklist);
router.patch('/update/:id', [checkJWT], checklistController.updateChecklist);
router.delete('/delete/:id', [checkJWT, checkAdmin], checklistController.deleteChecklist);

router.patch('/item/:id', [checkJWT], (req, res) => checklistController.updateChecklistItem(req, res));
router.post('/item/:checklistId/media/:itemName', [checkJWT], (req, res) => checklistController.addMediaToChecklistItem(req, res));

router.get('/:id', [checkJWT], (req, res) => checklistController.getChecklistById(req, res));
router.get('/:examCenterId/:userId', [checkJWT], (req, res) => checklistController.getChecklistsByExamCenterAndUser(req, res));



export { router as ChecklistRoutes }; 

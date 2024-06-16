import { Router } from 'express';
import { EmployeeTypeController } from '../controllers/employeeTypeController';
import { Container } from 'typedi';
import { checkJWT, checkAdmin } from '../middleware/auth.middleware';

const router = Router();
const employeeTypeController = Container.get(EmployeeTypeController);

router.post('/create', [checkJWT, checkAdmin], employeeTypeController.createEmployeeType);
router.patch('/update/:id', [checkJWT, checkAdmin], employeeTypeController.updateEmployeeType);
router.delete('/delete/:id', [checkJWT, checkAdmin], employeeTypeController.deleteEmployeeType);

export { router as EmployeeTypeRoutes };

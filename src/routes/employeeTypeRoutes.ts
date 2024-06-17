import { Router } from 'express';
import { EmployeeTypeController } from '../controllers/employeeTypeController';
import { Container } from 'typedi';
import { checkJWT, checkAdmin } from '../middleware/auth.middleware';

const router = Router();
const employeeTypeController = Container.get(EmployeeTypeController);

router.post('/create', [checkJWT, checkAdmin], employeeTypeController.createEmployeeType);
router.patch('/update/:id', [checkJWT, checkAdmin], employeeTypeController.updateEmployeeType);
router.delete('/delete/:id', [checkJWT, checkAdmin], employeeTypeController.deleteEmployeeType);

router.get('/', (req, res) => employeeTypeController.getEmployeeTypes(req, res));
router.get('/:id', (req, res) => employeeTypeController.getEmployeeTypeById(req, res));

export { router as EmployeeTypeRoutes };

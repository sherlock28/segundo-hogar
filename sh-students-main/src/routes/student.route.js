import { Router } from 'express';
import { studentCtrl } from '../controllers/student.ctrl.js';
import { validateStudentData } from '../middlewares/validateStudentData.js';

const router = Router();

router.post('/', validateStudentData, studentCtrl.isValidStudent);

export default router;

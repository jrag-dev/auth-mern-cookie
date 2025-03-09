import { Router } from "express";
import { isAuthRequired } from "../middlewares/validateToken.js";
import TaskController from "../controllers/tasks.controller.js";

const router = Router();
const taskController = new TaskController();

// Private routes
router.post('/', isAuthRequired, taskController.create);
router.get('/', isAuthRequired, taskController.findAll);
router.get('/:id', isAuthRequired, taskController.findOne);
router.put('/:id', isAuthRequired, taskController.update);
router.delete('/:id', isAuthRequired, taskController.delete);


export default router;
import { Router } from "express";
import { isAuthRequired } from "../middlewares/validateToken.js";
import TaskController from "../controllers/tasks.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskSchema, uptateTaskSchema } from "../schemas/task.schema.js";

const router = Router();
const taskController = new TaskController();

// Private routes
router.post('/', [isAuthRequired, validateSchema(createTaskSchema)], taskController.create);
router.get('/', isAuthRequired, taskController.findAll);
router.get('/:id', isAuthRequired, taskController.findOne);
router.put('/:id', [isAuthRequired, validateSchema(uptateTaskSchema)], taskController.update);
router.patch('/completed/:id', isAuthRequired, taskController.completedTask);
router.patch('/uncompleted/:id', isAuthRequired, taskController.uncompletedTask);
router.delete('/:id', isAuthRequired, taskController.delete);


export default router;
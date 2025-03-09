import Task from '../models/tasks.model.js';


class TaskController {

  async create(req, res) {
    const { title, description } = req.body;

    try {
      const taskObject = new Task(
        {
          title,
          description,
          user: req.user.id
        }
      )

      const task = await taskObject.save();

      res.status(201).json(
        {
          message: 'Tarea creada correctamente',
          success: true,
          task
        }
      )
    } catch (err) {
      res.status(500).json(
        {
          message: err.message,
          success: false
        }
      )
    }
  }

  async findAll(req, res) {
    const { id } = req.user;

    try {
      const tasks = await Task.find({ user: id });
      res.status(200).json(
        {
          message: 'Tareas encontradas correctamente',
          success: true,
          tasks
        }
      )
    } catch (err) {
      res.status(500).json(
        {
          message: err.message,
          success: false
        }
      )
    }
  }

  async findOne(req, res) {
    const { id: userId } = req.user;
    const { id } = req.params;

    try {
      const task = await Task
        .findOne({ _id: id, user: userId })
        .populate("user");

      if (!task) {
        const error = new Error('Tarea no encontrada');
        return res.status(404).json(
          {
            message: error.message,
            success: false
          }
        )
      }
      res.status(200).json(
        {
          message: 'Tarea encontreada correctamente',
          success: true,
          task
        }
      )
    } catch (err) {
      res.status(500).json(
        {
          message: err.message,
          success: false
        }
      )
    }
  }

  async update(req, res) {
    const {title, description } = req.body;
    const { id: userId } = req.user;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      const error = new Error('Tarea no encontrada');
      return res.status(404).json(
        {
          message: error.message,
          success: false
        }
      )
    }
    try {
      task.title = title || task.title;
      task.description = description || task.description;
      const updatedTask = await task.save();

      res.status(200).json(
        {
          message: 'Tarea actualizada correctamente',
          success: true,
          task: updatedTask._doc
        }
      )
    } catch (err) {
      res.status(500).json(
        {
          message: err.message,
          success: false
        }
      )
    }
  }

  async delete(req, res) {
    const { id: userId } = req.user;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      const error = new Error('Tarea no encontrada');
      return res.status(404).json(
        {
          message: error.message,
          success: false
        }
      )
    }

    try {
      const deletedTask = await Task.findOneAndDelete({ _id: id });
      console.log(deletedTask)
      res.status(200).json(
        {
          message: 'Tarea eliminada correctamente',
          success: true,
          task: deletedTask
        }
      )
    } catch (err) {
      res.status(500).json(
        {
          message: err.message,
          success: false
        }
      )
    }
  }

  async completedTask(req, res) {
    const { id: userId } = req.user;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      const error = new Error('Tarea no encontrada');
      return res.status(404).json(
        {
          message: error.message,
          success: false
        }
      )
    }

    try {
      task.completed = true;
      await task.save();

      res.status(200).json(
        {
          message: 'Tarea completada correctamente',
          success: true,
          task
        }
      )
    } catch (err) {
      res.status(500).json(
        {
          message: err.message,
          success: false
        }
      )
    }
  }

  async uncompletedTask(req, res) {
    const { id: userId } = req.user;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) {
      const error = new Error('Tarea no encontrada');
      return res.status(404).json(
        {
          message: error.message,
          success: false
        }
      )
    }

    try {
      task.completed = false;
      await task.save();

      res.status(200).json(
        {
          message: 'Estado de la tarea actualizado correctamente',
          success: true,
          task
        }
      )
    } catch (err) {
      res.status(500).json(
        {
          message: err.message,
          success: false
        }
      )
    }
  }

}

export default TaskController;
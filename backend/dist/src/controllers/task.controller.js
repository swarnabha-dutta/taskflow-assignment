import { taskService } from "../services/task.service.js";
export const getTasks = async (req, res) => {
    const priority = req.query.priority;
    const tasks = priority
        ? await taskService.getTasksByPriority(priority)
        : await taskService.getAllTasks();
    res.status(200).json({
        success: true,
        data: tasks,
    });
};
export const getTaskById = async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    res.status(200).json({
        success: true,
        data: task,
    });
};
export const getTasksByColumn = async (req, res) => {
    const tasks = await taskService.getTasksByColumn(req.params.columnId);
    res.status(200).json({
        success: true,
        data: tasks,
    });
};
export const createTask = async (req, res) => {
    const task = await taskService.createTask(req.body);
    res.status(201).json({
        success: true,
        data: task,
    });
};
export const updateTask = async (req, res) => {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.status(200).json({
        success: true,
        data: task,
    });
};
export const moveTask = async (req, res) => {
    const task = await taskService.moveTask(req.params.id, req.body.columnId);
    res.status(200).json({
        success: true,
        data: task,
    });
};
export const deleteTask = async (req, res) => {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
};

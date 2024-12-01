import { Request, Response, NextFunction } from "express";
import Todo from "../models/todo";

export const getTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const todos = await Todo.findAll({
      where: { userId: Number(req.user?.id) },
    });
    res.json(todos);
  } catch (error) {
    next(error); 
  }
};

export const createTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title } = req.body;
    const newTodo = await Todo.create({
      title,
      completed: false,
      userId: Number(req.user?.id),
    });
    res.status(201).json(newTodo);
  } catch (error) {
    next(error); 
  }
};

export const updateTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const todo= await Todo.findOne({where: {id: id, userId: Number(req.user?.id)}});
    
    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    if (title) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    res.json(todo);
  } catch (error) {
    next(error); 
  }
};

export const deleteTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);

    if (!todo) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    await todo.destroy();
    res.status(204).send();
  } catch (error) {
    next(error); 
  }
};

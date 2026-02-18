import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { createTasksService } from "../services/firestoreTasksService.js";
import { TaskForm } from "../components/Tasks/TaskForm.jsx";
import { TaskList } from "../components/Tasks/TaskList.jsx";
import { TaskFilters } from "../components/Tasks/TaskFilters.jsx";
import { TaskHistory } from "../components/Tasks/TaskHistory.jsx";

export const TasksPage = () => {
  const { user } = useAuth();
  const tasksService = createTasksService(() => user?._id ?? user?.id);
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [filters, setFilters] = useState({});

  const load = async (currentFilters = filters) => {
    const query = { ...currentFilters };
    if (query.date) {
      query.fromDate = query.date;
      query.toDate = query.date;
    }
    const all = await tasksService.list(query);
    const hist = await tasksService.history(20);
    setTasks(all);
    setHistory(hist);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (payload) => {
    const created = await tasksService.create(payload);
    setTasks((t) => [...t, created]);
  };

  const handleToggleStatus = async (id, status) => {
    const updated = await tasksService.updateStatus(id, status);
    setTasks((t) => t.map((x) => (x._id === id ? updated : x)));
    load();
  };

  const handleDelete = async (id) => {
    await tasksService.remove(id);
    setTasks((t) => t.filter((x) => x._id !== id));
    load();
  };

  const handleFiltersChange = (next) => {
    setFilters(next);
    load(next);
  };

  return (
    <div className="page-pad">
      <h2 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "clamp(20px, 4vw, 24px)" }}>Tasks</h2>
      <TaskForm onSubmit={handleCreate} />
      <TaskFilters filters={filters} onChange={handleFiltersChange} />
      <TaskList tasks={tasks} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
      <TaskHistory tasks={history} />
    </div>
  );
};


import React, { useState, useEffect } from 'react';

import Footer from '../footer';
import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';
import './App.css';

const TIMER_UPDATE_INTERVAL = 1000;

export default function App() {
  const [currentFilter, setCurrentFilter] = useState('All');
  const [tasks, setTasks] = useState([]);

  // Clear all intervals on unmount
  useEffect(
    () => () => {
      tasks.forEach((task) => {
        if (task.interval) {
          clearInterval(task.interval);
        }
      });
    },
    []
  );

  const actions = {
    add: (task) => {
      return [...tasks, task];
    },
    edit: (task) => {
      return tasks.map((t) => (t.id === task.id ? task : t));
    },
    delete: (tasksToDelete) => {
      const tasksToDeleteArray = Array.isArray(tasksToDelete) ? tasksToDelete : [tasksToDelete];
      return tasks.filter((t) => !tasksToDeleteArray.includes(t));
    },
    start: (task) => {
      const updateTaskInState = (changedProps) => (tasksInState) => {
        const updateTaskProps = (currentTask) => {
          const currentTitle = tasksInState.find((t) => t.id === task.id).title;
          return { ...currentTask, title: currentTitle, ...changedProps };
        };
        const updatedTasks = tasksInState.map((t) => (t.id === task.id ? updateTaskProps(t) : t));
        return updatedTasks;
      };
      if (task.interval || task.timeRemaining === 0) return;
      let { timeRemaining } = task;

      const interval = setInterval(() => {
        timeRemaining -= 1;
        setTasks(updateTaskInState({ timeRemaining, interval }));
        if (timeRemaining === 0) {
          clearInterval(interval);
          setTasks(updateTaskInState({ timeRemaining: 0, interval: null }));
        }
      }, TIMER_UPDATE_INTERVAL);
    },
    stop: (task) => {
      if (!task.interval) return;
      setTasks(actions.edit({ ...task, interval: null }));
      clearInterval(task.interval);
    },
  };

  const handlers = {
    handleTaskAction: (action) => (task) => {
      if (!actions[action]) {
        throw new Error(`Unknown action: ${action}`);
      }
      const changedTasks = actions[action](task);
      if (action === 'start' || action === 'stop') return;
      setTasks(changedTasks);
    },
    handleFilterChange: (filter) => () => {
      if (filter === currentFilter) return;
      setCurrentFilter(filter);
    },
    handleClearCompleted: () => {
      handlers.handleTaskAction('delete')(tasks.filter((t) => t.completed));
    },
  };

  const { handleTaskAction, handleFilterChange, handleClearCompleted } = handlers;
  const lastIdx = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) : 0;
  const tasksTitles = tasks.map((t) => t.title);
  const activeTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <section className="todoapp">
      <NewTaskForm onNewTask={handleTaskAction('add')} lastIdx={lastIdx} tasksTitles={tasksTitles} />
      <section className="main">
        <TaskList
          tasks={tasks}
          onTaskEdit={handleTaskAction('edit')}
          onTaskDelete={handleTaskAction('delete')}
          onTaskStart={handleTaskAction('start')}
          onTaskStop={handleTaskAction('stop')}
          currentFilter={currentFilter}
        />
        <Footer
          todo={activeTasksCount}
          currentFilter={currentFilter}
          handleFilterChange={handleFilterChange}
          handleClearCompleted={handleClearCompleted}
        />
      </section>
    </section>
  );
}
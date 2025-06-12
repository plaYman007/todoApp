import React from 'react';

import Footer from '../footer';
import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';
import './App.css';

const TIMER_UPDATE_INTERVAL = 1000;

export default class App extends React.Component {
  #actions = {
    add: (task) => {
      const { tasks } = this.state;
      return [...tasks, task];
    },
    edit: (task) => {
      const { tasks } = this.state;
      return tasks.map((t) => (t.id === task.id ? task : t));
    },
    delete: (tasksToDelete) => {
      const { tasks } = this.state;
      const tasksToDeleteArray = Array.isArray(tasksToDelete) ? tasksToDelete : [tasksToDelete];
        tasksToDeleteArray.forEach(task => {
    if (task.interval) {
      clearInterval(task.interval);
    }
  });
      return tasks.filter((t) => !tasksToDeleteArray.includes(t));
    },
    start: (task) => {
      
      const updateTask = (changedProps) => (state) => {
        const { tasks } = state;
        const foundTask = tasks.find((t) => t.id === task.id);
if (!foundTask) return; 

const currentTitle = foundTask.title;
        return {
          tasks: state.tasks.map((t) => (t.id === task.id ? { ...t, title: currentTitle, ...changedProps } : t)),
        };
      };
      if (task.interval || task.timeRemaining === 0) return;
      let { timeRemaining } = task;

      const interval = setInterval(() => {
        timeRemaining -= 1;
        this.setState(updateTask({ timeRemaining, interval }));
        if (timeRemaining === 0) {
          clearInterval(interval);
          this.setState(updateTask({ timeRemaining: 0, interval: null }));
        }
      }, TIMER_UPDATE_INTERVAL);
    },
    stop: (task) => {
      if (!task.interval) return;
      this.setState({ tasks: this.#actions.edit({ ...task, interval: null }) });
      clearInterval(task.interval);
    },
  };

  #handlers = {
    handleTaskAction: (action) => (task) => {
      if (!this.#actions[action]) {
        throw new Error(`Unknown action: ${action}`);
      }
      const changedTasks = this.#actions[action](task);
      if (action === 'start' || action === 'stop') return;
      this.setState({ tasks: changedTasks });
    },
    handleFilterChange: (filter) => () => {
      const { currentFilter } = this.state;
      if (filter === currentFilter) return;
      this.setState({ currentFilter: filter });
    },
    handleClearCompleted: () => {
      const { tasks } = this.state;
      this.#handlers.handleTaskAction('delete')(tasks.filter((t) => t.completed));
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      currentFilter: 'All',
      tasks: [],
      // tasks: [
      //   { id: 0, title: 'Task 1', completed: false, created: Date.now(), timeRemaining: 0, interval: null },
      //   { id: 1, title: 'Task 2', completed: false, created: Date.now(), timeRemaining: 0, interval: null },
      //   { id: 2, title: 'Task 3', completed: false, created: Date.now(), timeRemaining: 0, interval: null },
      // ],
    };
  }

  componentWillUnmount() {
    const { tasks } = this.state;
    tasks.forEach((t) => t?.interval && clearInterval(t.interval));
  }

  render() {
    const { currentFilter, tasks } = this.state;
    const { handleTaskAction, handleFilterChange, handleClearCompleted } = this.#handlers;

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
}

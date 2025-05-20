import React from 'react';

import Footer from '../footer';
import NewTaskForm from '../new-task-form';
import TaskList from '../task-list';
import './App.css';

export default class App extends React.Component {
  #actionsWithData = {
    add: (task) => {
      const { tasks } = this.state;
      return [...tasks, task];
    },
    edit: (task) => {
      const { tasks } = this.state;
      return tasks.map((t) => (t.id === task.id ? task : t));
    },
    delete: (...tasksToDelete) => {
      const { tasks } = this.state;
      return tasks.filter((t) => !tasksToDelete.includes(t));
    },
  };

  #handlers = {
    handleTaskAction: (action) => (task) => {
      if (!this.#actionsWithData[action]) {
        throw new Error(`Unknown action: ${action}`);
      }
      this.setState({ tasks: this.#actionsWithData[action](task) });
    },
    handleFilterChange: (filter) => () => {
      const { currentFilter } = this.state;
      if (filter === currentFilter) return;
      this.setState({ currentFilter: filter });
    },
    handleClearCompleted: () => {
      const { tasks } = this.state;
      this.#handlers.handleTaskAction('delete')(...tasks.filter((t) => t.completed));
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      currentFilter: 'All',
      tasks: [
        {
          id: 1,
          created: Date.parse('2025-05-05'),
          title: 'Task 1',
          completed: false,
        },
        {
          id: 2,
          created: Date.parse('2025-05-06'),
          title: 'Task 2',
          completed: true,
        },
      ],
    };
  }

  render() {
    const { currentFilter, tasks } = this.state;
    const { handleTaskAction, handleFilterChange, handleClearCompleted } = this.#handlers;

    const lastIdx = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) : 0;
    const activeTasksCount = tasks.filter((t) => !t.completed).length;

    return (
      <section className="todoapp">
        <NewTaskForm onNewTask={handleTaskAction('add')} lastIdx={lastIdx} />
        <section className="main">
          <TaskList
            tasks={tasks}
            onTaskEdit={handleTaskAction('edit')}
            onTaskDelete={handleTaskAction('delete')}
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
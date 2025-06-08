import { PropTypes } from 'prop-types';
import { React } from 'react';

import Task from '../task';
import './task-list.css';

function TaskList({ tasks, onTaskEdit, onTaskDelete, onTaskStart, onTaskStop, currentFilter }) {
  TaskList.propTypes = {
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        created: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired,
        timeRemaining: PropTypes.number.isRequired,
      })
    ).isRequired,
    onTaskEdit: PropTypes.func.isRequired,
    onTaskDelete: PropTypes.func.isRequired,
    onTaskStart: PropTypes.func.isRequired,
    onTaskStop: PropTypes.func.isRequired,
    currentFilter: PropTypes.oneOf(['All', 'Active', 'Completed']).isRequired,
  };
  const filters = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };

  const filteredTasks = tasks.filter(filters[currentFilter]);

  const tasksTitles = tasks.map((task) => task.title);

  const tasksList = filteredTasks.map((taskData) => (
    <Task
      key={taskData.id}
      task={taskData}
      tasksTitles={tasksTitles}
      onTaskEdit={onTaskEdit}
      onTaskDelete={onTaskDelete}
      onTaskStart={onTaskStart}
      onTaskStop={onTaskStop}
    />
  ));

  return <ul className="todo-list">{tasksList}</ul>;
}

export default TaskList;

import { PropTypes } from 'prop-types';
import { React } from 'react';

import Task from '../task';
import './task-list.css';

function TaskList({ tasks, onTaskEdit, onTaskDelete, currentFilter }) {
  TaskList.propTypes = {
    tasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired,
      })
    ).isRequired,
    onTaskEdit: PropTypes.func.isRequired,
    onTaskDelete: PropTypes.func.isRequired,
    currentFilter: PropTypes.oneOf(['All', 'Active', 'Completed']).isRequired,
  };

  const filters = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };

  const filteredTasks = tasks.filter(filters[currentFilter]);

  const tasksList = filteredTasks.map((taskData) => (
    <Task key={taskData.id} task={taskData} onTaskEdit={onTaskEdit} onTaskDelete={onTaskDelete} />
  ));

  return <ul className="todo-list">{tasksList}</ul>;
}

export default TaskList;

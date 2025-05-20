import React from 'react';
import { PropTypes } from 'prop-types';
import './tasks-filter.css';

function TasksFilter({ currentFilter, handleFilterChange }) {
  return (
    <ul className="filters">
      {['All', 'Active', 'Completed'].map((filter) => (
        <li key={filter}>
          <button
            type="button"
            className={currentFilter === filter ? 'selected' : null}
            onClick={handleFilterChange(filter)}
          >
            {filter}
          </button>
        </li>
      ))}
    </ul>
  );
}

TasksFilter.propTypes = {
  currentFilter: PropTypes.oneOf(['All', 'Active', 'Completed']).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
};

export default TasksFilter;

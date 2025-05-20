import { PropTypes } from 'prop-types';
import React from 'react';

import TasksFilter from '../tasks-filter';
import './footer.css';

function Footer({ todo, currentFilter, handleFilterChange, handleClearCompleted }) {
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{todo}</strong>
        <span> items left</span>
      </span>
      <TasksFilter currentFilter={currentFilter} handleFilterChange={handleFilterChange} />
      <button type="button" className="clear-completed" onClick={handleClearCompleted}>
        Clear completed
      </button>
    </footer>
  );
}

Footer.propTypes = {
  todo: PropTypes.number.isRequired,
  currentFilter: PropTypes.oneOf(['All', 'Active', 'Completed']).isRequired,
  handleFilterChange: PropTypes.func.isRequired,
  handleClearCompleted: PropTypes.func.isRequired,
};

export default Footer;

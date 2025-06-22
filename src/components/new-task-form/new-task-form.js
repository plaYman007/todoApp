import { PropTypes } from 'prop-types';
import React from 'react';

import TaskValidator from '../../utils/validation';
import './new-task-form.css';

export default function NewTaskForm({ tasksTitles, onNewTask, lastIdx }) {
  const labelInput = React.useRef(null);
  const minInput = React.useRef(null);
  const secInput = React.useRef(null);

  const handleInput = (e) => {
    if (e.key !== 'Enter') return;
    const [label, min, sec] = [labelInput.current, minInput.current, secInput.current];

    const { error } = TaskValidator.validateTask(label.value, min.value, sec.value, tasksTitles);
    if (error) {
      alert(error);
      return;
    }

    const totalSec = parseInt(min.value || 0, 10) * 60 + parseInt(sec.value || 0, 10);

    const task = {
      id: lastIdx + 1,
      created: Date.now(),
      title: label.value,
      completed: false,
      timeRemaining: totalSec,
    };

    [label, min, sec].forEach((input) => {
      // eslint-disable-next-line no-param-reassign
      input.value = '';
    });

    onNewTask(task);
  };

  return (
    <header className="header">
      <h1>todos</h1>
      <form className="new-todo-form">
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          type="text"
          ref={labelInput}
          onKeyDown={handleInput}
        />
        <input
          type="number"
          min={0}
          max={59}
          ref={minInput}
          className="new-todo-form__timer"
          placeholder="Min"
          onKeyDown={handleInput}
        />
        <input
          type="number"
          min={0}
          max={59}
          ref={secInput}
          className="new-todo-form__timer"
          placeholder="Sec"
          onKeyDown={handleInput}
        />
      </form>
    </header>
  );
}

NewTaskForm.propTypes = {
  tasksTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onNewTask: PropTypes.func.isRequired,
  lastIdx: PropTypes.number.isRequired,
};
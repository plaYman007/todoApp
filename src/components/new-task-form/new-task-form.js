import { PropTypes } from 'prop-types';
import React from 'react';

import TaskValidator from '../../utils/validation';
import './new-task-form.css';

export default class NewTaskForm extends React.Component {
  #timerMin = React.createRef();

  #timerSec = React.createRef();

  #labelInput = React.createRef();

  handleInputBlur = (e) => {
    if (e.key !== 'Enter') return;
    const { tasksTitles } = this.props;
    const [labelInput, minInput, secInput] = [this.#labelInput.current, this.#timerMin.current, this.#timerSec.current];

    const { error } = TaskValidator.validateTask(labelInput.value, minInput.value, secInput.value, tasksTitles);
    if (error) {
      alert(error);
      return;
    }

    const totalSec = parseInt(minInput.value || 0, 10) * 60 + parseInt(secInput.value || 0, 10);

    const { lastIdx, onNewTask } = this.props;
    const task = {
      id: lastIdx + 1,
      created: Date.now(),
      title: labelInput.value,
      completed: false,
      timeRemaining: totalSec,
    };

    [labelInput, minInput, secInput].forEach((input) => {
      // eslint-disable-next-line no-param-reassign
      input.value = '';
    });

    onNewTask(task);
  };

  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <form className="new-todo-form">
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            type="text"
            ref={this.#labelInput}
            onKeyDown={this.handleInputBlur}
          />
          <input
            type="number"
            min={0}
            max={59}
            ref={this.#timerMin}
            className="new-todo-form__timer"
            placeholder="Min"
            onKeyDown={this.handleInputBlur}
          />
          <input
            type="number"
            min={0}
            max={59}
            ref={this.#timerSec}
            className="new-todo-form__timer"
            placeholder="Sec"
            onKeyDown={this.handleInputBlur}
          />
        </form>
      </header>
    );
  }
}

NewTaskForm.propTypes = {
  tasksTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onNewTask: PropTypes.func.isRequired,
  lastIdx: PropTypes.number.isRequired,
};

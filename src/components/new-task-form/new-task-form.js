import { PropTypes } from 'prop-types';
import React from 'react';
import './new-task-form.css';

export default class NewTaskForm extends React.Component {
  handleInputBlur = (e) => {
    const [label, key] = [e.target.value.trim(), e.key];
    if (key !== 'Enter' || !label) return;

    const { lastIdx, onNewTask } = this.props;
    const task = {
      id: lastIdx + 1,
      created: Date.now(),
      title: label,
      completed: false,
    };

    e.target.value = '';
    onNewTask(task);
  };

  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <input className="new-todo" placeholder="What needs to be done?" type="text" onKeyDown={this.handleInputBlur} />
      </header>
    );
  }
}

NewTaskForm.propTypes = {
  onNewTask: PropTypes.func.isRequired,
  lastIdx: PropTypes.number.isRequired,
};

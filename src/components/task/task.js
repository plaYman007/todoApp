/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import './task.css';
import React from 'react';
import { formatDistanceToNow, formatDuration } from 'date-fns';
import { PropTypes } from 'prop-types';

import TaskValidator from '../../utils/validation';

const CREATION_TIME_UPDATE_INTERVAL = 10000;

export default class Task extends React.Component {
  #creationTimeUpdateInterval = null;
  #taskCreatedTime = 0;

  #actions = {
    setEditModeTo: (setTo) => this.setState({ isEditing: setTo }),

    editTask: (changedProperty) => {
      const { onTaskEdit, task } = this.props;
      onTaskEdit({ ...task, ...changedProperty });
      this.#actions.setEditModeTo(false);
    },
  };

  #handlers = {
    handleTitleChanged: ({ key, target }) => {
      switch (key) {
        case 'Escape':
          this.#actions.setEditModeTo(false);
          break;
        case 'Enter': {
          const { tasksTitles } = this.props;
          const { error } = TaskValidator.validateTask(
            target.value,
            0,
            0,
            tasksTitles
          );
          if (error) {
            alert(error);
            return;
          }
          this.#actions.editTask({ title: target.value });
          break;
        }
        default:
          break;
      }
    },
    handleToggleCompleted: () => {
      const { task } = this.props;
      clearInterval(task.interval);
      this.#actions.editTask({
        completed: !task.completed,
        timeRemaining: 0,
        interval: null,
      });
    },
    handleEditClick: () => {
      const { task } = this.props;
      const { isEditing } = this.state;
      if (isEditing || task.completed) return;
      this.#actions.setEditModeTo(true);
    },
    handleDeleteClick: () => {
      const { onTaskDelete, task } = this.props;
      return onTaskDelete(task);
    },
    onBlur: () => {
      this.#actions.setEditModeTo(false);
    },
  };

  constructor(props) {
    super(props);
    this.#taskCreatedTime = props.task.created;
    this.state = {
      isEditing: false,
      createdFormattedDate: formatDistanceToNow(this.#taskCreatedTime),
    };
  }

  componentDidMount() {
    this.#creationTimeUpdateInterval = setInterval(
      this.updateCreationTime,
      CREATION_TIME_UPDATE_INTERVAL
    );
  }

  componentDidUpdate(prevProps) {
    const {
      task: { timeRemaining },
    } = this.props;
    const { isEditing } = this.state;
    const { timeRemaining: prevTimeRemaining } = prevProps.task;
    return prevTimeRemaining !== timeRemaining && !isEditing;
  }

  componentWillUnmount() {
    clearInterval(this.#creationTimeUpdateInterval);
  }

  updateCreationTime = () => {
    this.setState({
      createdFormattedDate: formatDistanceToNow(this.#taskCreatedTime),
    });
  };

  render() {
    const { task, onTaskStart, onTaskStop } = this.props;
    const { createdFormattedDate, isEditing } = this.state;
    const {
      handleTitleChanged,
      handleToggleCompleted,
      handleEditClick,
      handleDeleteClick,
    } = this.#handlers;

    const editTaskInput = (
      <input
        className="edit"
        type="text"
        defaultValue={task.title}
        onKeyDown={handleTitleChanged}
        onBlur={this.#handlers.onBlur}
      />
    );

    const timerControls = (
      <>
        <button
          type="button"
          className="icon icon-play"
          onClick={() => onTaskStart(task)}
        />
        <button
          type="button"
          className="icon icon-pause"
          onClick={() => onTaskStop(task)}
        />
      </>
    );

    const formattedTimeRemaining = new Date(
      0,
      0,
      0,
      0,
      0,
      task.timeRemaining
    );

    const formattedDuration = formatDuration({
      minutes: formattedTimeRemaining.getMinutes(),
      seconds: formattedTimeRemaining.getSeconds(),
    });

    return (
      <li
        className={
          (task.completed ? 'completed' : null) ||
          (isEditing ? 'editing' : null)
        }
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            onChange={handleToggleCompleted}
            defaultChecked={task.completed}
          />
          <label onDoubleClick={handleEditClick} htmlFor="title">
            <span id="title" className="title">
              {task.title}
            </span>
            <span className="description">
              {formattedDuration && !task.completed && timerControls}
              {(formattedDuration && task.completed) ||
                formattedDuration ||
                '0 minutes 0 seconds'}
            </span>
            <span className="description">{createdFormattedDate}</span>
          </label>
          <button
            type="button"
            className="icon icon-destroy"
            onClick={handleDeleteClick}
          />
          <button
            type="button"
            className="icon icon-edit"
            onClick={handleEditClick}
          />
        </div>
        {isEditing && !task.completed && editTaskInput}
      </li>
    );
  }
}

Task.propTypes = {
  onTaskEdit: PropTypes.func.isRequired,
  onTaskDelete: PropTypes.func.isRequired,
  onTaskStart: PropTypes.func.isRequired,
  onTaskStop: PropTypes.func.isRequired,
  tasksTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    created: PropTypes.number.isRequired,
    timeRemaining: PropTypes.number.isRequired,
    interval: PropTypes.number,
  }).isRequired,
};
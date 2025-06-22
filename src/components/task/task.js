/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import './task.css';
import React, { useEffect, useState } from 'react';
import { formatDistanceToNow, formatDuration } from 'date-fns';
import { PropTypes } from 'prop-types';

import TaskValidator from '../../utils/validation';

const CREATION_TIME_UPDATE_INTERVAL = 10000;

export default function Task({ task, onTaskEdit, onTaskDelete, onTaskStart, onTaskStop, tasksTitles }) {
  const [isEditing, setIsEditing] = useState(false);
  const [creationTimeFormatted, setCreationTimeFormatted] = useState(formatDistanceToNow(task.created));

  const handlers = {
handleTitleChanged: ({ key, target }) => {
  switch (key) {
    case 'Escape':
      setIsEditing(false);
      break;
    case 'Enter': {
      const trimmedValue = target.value.trim();
      const original = task.title.trim();
      if (trimmedValue === original) {
        setIsEditing(false);
        return;
      }
      const filteredTitles = tasksTitles.filter(title => title.trim() !== original);

      const { error } = TaskValidator.validateTask(trimmedValue, 0, 0, filteredTitles, original);

      if (error) {
        alert(error);
        return;
      }

      onTaskEdit({ ...task, title: trimmedValue });
      setIsEditing(false);
      break;
    }
    default:
      break;
  }
},
    handleToggleCompleted: () => {
      clearInterval(task.interval);
      onTaskEdit({ ...task, completed: !task.completed, timeRemaining: 0, interval: null });
    },
    handleEditClick: () => {
      if (isEditing || task.completed) return;
      setIsEditing(true);
    },
    handleDeleteClick: () => {
      onTaskDelete(task);
    },
  };

useEffect(() => {
  const updateCreationTime = () => {
    setCreationTimeFormatted(formatDistanceToNow(task.created));
  };

  const interval = setInterval(updateCreationTime, CREATION_TIME_UPDATE_INTERVAL);
  return () => clearInterval(interval);
}, [task.created]);

  const formattedDuration =
    task.timeRemaining === 0
      ? '0 мин 0 сек'
      : formatDuration({
          minutes: new Date(0, 0, 0, 0, 0, task.timeRemaining).getMinutes(),
          seconds: new Date(0, 0, 0, 0, 0, task.timeRemaining).getSeconds(),
        });

  const timerControlsAndTime = (
    <>
      <button type="button" className="icon icon-play" onClick={() => onTaskStart(task)} />
      <button type="button" className="icon icon-pause" onClick={() => onTaskStop(task)} />
      <span>{formattedDuration}</span>
    </>
  );

  const isShowTimerControls = task.timeRemaining && !task.completed && timerControlsAndTime;

  return (
    <li className={(task.completed ? 'completed' : null) || (isEditing ? 'editing' : null)}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          onChange={handlers.handleToggleCompleted}
          defaultChecked={task.completed}
        />
        <label onDoubleClick={handlers.handleEditClick} htmlFor="title">
          <span id="title" className="title">
            {task.title}
          </span>
          <span className="description">{isShowTimerControls || '0 мин 0 сек'}</span>
          <span className="description">{creationTimeFormatted}</span>
        </label>
        <button type="button" className="icon icon-destroy" onClick={handlers.handleDeleteClick} />
        <button type="button" className="icon icon-edit" onClick={handlers.handleEditClick} />
      </div>
      {/* Рендер поля редактирования наименования задачи если задача не завершена */}
      {isEditing && !task.completed && (
        <input
          className="edit"
          type="text"
          defaultValue={task.title}
          onKeyDown={handlers.handleTitleChanged}
          onBlur={() => setIsEditing(false)}
        />
      )}
    </li>
  );
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
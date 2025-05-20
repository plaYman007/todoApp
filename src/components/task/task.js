/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import './task.css'
import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { PropTypes } from 'prop-types'

const TIME_INTERVAL = 10000

export default class Task extends React.Component {
  #updateInterval = null

  #created = 0 // время создания задачи

  #actions = {
    setEditModeTo: (setTo) => this.setState({ isEditing: setTo }),

    editTask: (changedProperty) => {
      const { onTaskEdit, task } = this.props
      onTaskEdit({ ...task, ...changedProperty })
      this.#actions.setEditModeTo(false)
    },
  }

  #handlers = {
    handleTitleChanged: ({ key, target }) => {
      if (key === 'Enter') this.#actions.editTask({ title: target.value })
    },

    handleToggleCompleted: () => {
      const { task } = this.props
      this.#actions.editTask({ completed: !task.completed })
    },

    handleEditClick: () => {
      const { task } = this.props
      const { isEditing } = this.state
      if (isEditing || task.completed) return

      this.#actions.setEditModeTo(true)
    },

    handleDeleteClick: () => {
      const { onTaskDelete, task } = this.props
      return onTaskDelete(task)
    },
  }

  constructor(props) {
    super(props)
    this.#created = props.task.created
    this.state = {
      isEditing: false, // режим редактирования
      createdFormattedDate: formatDistanceToNow(this.#created), // форматированное время создания
    }
  }

  // #region Обновление интервала
  componentDidMount() {
    this.#updateInterval = setInterval(this.updateNowTimeCreated, TIME_INTERVAL)
  }

  componentWillUnmount() {
    clearInterval(this.#updateInterval)
  }

  // коллбэк для интервала; обновление времени создания
  updateNowTimeCreated = () => {
    this.setState({ createdFormattedDate: formatDistanceToNow(this.#created) })
  }

  // #endregion

  render() {
    const {
      task: { title, completed },
    } = this.props
    const { createdFormattedDate, isEditing } = this.state
    const {
      handleTitleChanged, // обработчик изменения заголовка
      handleToggleCompleted, // обработчик изменения статуса задачи
      handleEditClick, // обработчик редактирования задачи
      handleDeleteClick, // обработчик удаления задачи
    } = this.#handlers

    const inputFormWhenEditingTask = (
      <input className="edit" type="text" defaultValue={title} onKeyDown={handleTitleChanged} />
    )

    return (
      <li className={(completed ? 'completed' : null) || (isEditing ? 'editing' : null)}>
        <div className="view">
          <input className="toggle" type="checkbox" onChange={handleToggleCompleted} defaultChecked={completed} />
          <label onDoubleClick={handleEditClick}>
            <span className="description">{title}</span>
            <span className="created">{createdFormattedDate}</span>
          </label>
          <button type="button" className="icon icon-destroy" onClick={handleDeleteClick} />
          <button type="button" className="icon icon-edit" onClick={handleEditClick} />
        </div>
        {/* Рендер поля редактирования наименования задачи если задача не завершена */}
        {isEditing && !completed && inputFormWhenEditingTask}
      </li>
    )
  }
}

Task.propTypes = {
  onTaskEdit: PropTypes.func.isRequired,
  onTaskDelete: PropTypes.func.isRequired,
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    created: PropTypes.number.isRequired,
  }).isRequired,
}

export default class TaskValidator {
  static validateTask(title, minutes, seconds, titles = []) {
    const titleError = TaskValidator.#titleValidator(title, titles);
    const timeError = TaskValidator.#timeValidator(minutes, seconds);
    if (titleError) {
      return { error: titleError };
    }
    if (timeError) {
      return { error: timeError };
    }
    return { valid: true };
  }

  static #titleValidator(title, titles = []) {
    if (!title.trim()) {
      return 'Название задачи не может быть пустым';
    }
    if (title.length > 50) {
      return 'Название задачи не может быть длиннее 50 символов';
    }

    if (titles.includes(title) || titles.filter((t) => t === title).length > 1) {
      return 'Такая задача уже есть';
    }
    return null;
  }

  static #timeValidator(minutes, seconds) {
    if (minutes < 0 || minutes > 60) {
      return 'Количество минут должно быть от 0 до 60';
    }

    if (seconds < 0 || seconds > 60) {
      return 'Количество секунд должно быть от 0 до 60';
    }

    return null;
  }
}
import Card from './card';

export default class Container {
  constructor() {
    this.container = null;
    this.tasksTodo = [];
    this.tasksProgress = [];
    this.tasksDone = [];
    this.tasks = [this.tasksTodo, this.tasksProgress, this.tasksDone];
    this.addInput = this.addInput.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.saveState = this.saveState.bind(this);
    this.update = this.update.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.dragMove = this.dragMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.drawSavedTasks = this.drawSavedTasks.bind(this);
    this.showPossiblePlace = this.showPossiblePlace.bind(this);
  }

  init() {
    this.update();
    this.drawUI();
    this.drawPushedCards();
    this.clickAddBtn();
    window.addEventListener('beforeunload', this.saveState);
  }

  update() {
    this.tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  saveState() {
    this.tasksTodo = [];
    this.tasksProgress = [];
    this.tasksDone = [];
    const todo = this.container.querySelector('.todo');
    const progress = this.container.querySelector('.in-progress');
    const done = this.container.querySelector('.done');
    const tasksTodo = [...todo.querySelectorAll('.task')];
    const tasksProgress = [...progress.querySelectorAll('.task')];
    const tasksDone = [...done.querySelectorAll('.task')];
    tasksTodo.forEach((task) => this.tasksTodo.push(task.textContent));
    tasksProgress.forEach((task) => this.tasksProgress.push(task.textContent));
    tasksDone.forEach((task) => this.tasksDone.push(task.textContent));
    this.tasks = [this.tasksTodo, this.tasksProgress, this.tasksDone];
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  clickAddBtn() {
    const addList = this.container.querySelectorAll('.btn-add');
    [...addList].forEach((el) => el.addEventListener('click', this.addInput));
  }

  drawUI() {
    this.container = document.createElement('div');
    this.container.classList.add('container');
    this.container.innerHTML = `<div class="card">
    <h2 class="title">todo</h2>
    <div class="tasks-list todo"></div>
    <div class="btn-add">+ Add another card</div>
  </div>
  <div class="card">
    <h2 class="title">in progress</h2>
    <div class="tasks-list in-progress" id="trew"></div>
    <div class="btn-add">+ Add another card</div>
  </div>
  <div class="card">
    <h2 class="title">done</h2>
    <div class="tasks-list done"></div>
    <div class="btn-add">+ Add another card</div>
  </div>`;
    document.querySelector('body').append(this.container);
  }

  drawPushedCards() {
    const parents = ['.todo', '.in-progress', '.done'];
    for (let i = 0; i < parents.length; i += 1) {
      const parent = this.container.querySelector(parents[i]);

      this.tasks[i].forEach((item) => {
        new Card(parent, item).addTask();

        if (i === 0) {
          this.tasksTodo.push(item);
        }
        if (i === 1) {
          this.tasksProgress.push(item);
        }
        if (i === 2) {
          this.tasksDone.push(item);
        }
      });

      this.toAppoint();
    }
  }

  addInput(event) {
    const newCardForm = document.createElement('form');
    newCardForm.classList.add('card-form');
    newCardForm.innerHTML = `
    <textarea class="textarea" type ="text" placeholder="Enter a title for this card"></textarea>
    <div class="buttons">
      <button class="add-card-btn buttons">Add Card</button>
      <button class="close-form-btn buttons">Close</button>
    </div>
 `;
    const closestColumn = event.target.closest('.card');
    event.target.replaceWith(newCardForm);
    const add = closestColumn.querySelector('.add-card-btn');
    const close = closestColumn.querySelector('.close-form-btn');
    add.addEventListener('click', this.addNewTask);
    close.addEventListener('click', this.closeForm);
  }

  closeForm(event) {
    event.preventDefault();
    const columnAdd = document.createElement('div');
    columnAdd.classList.add('btn-add');
    columnAdd.textContent = '+ Add another card';
    const parent = event.target.closest('.card');
    const child = parent.querySelector('.card-form');
    parent.removeChild(child);
    parent.appendChild(columnAdd);
    columnAdd.addEventListener('click', this.addInput);
  }

  addNewTask(event) {
    event.preventDefault();
    const closestColumn = event.target.closest('.card');
    const parent = closestColumn.querySelector('.tasks-list');
    const task = closestColumn.querySelector('.textarea').value;
    if (task) {
      new Card(parent, task).addTask();
      const columnAdd = document.createElement('div');
      columnAdd.classList.add('btn-add');
      columnAdd.textContent = '+ Add another card';
      closestColumn.removeChild(closestColumn.querySelector('.card-form'));
      closestColumn.appendChild(columnAdd);
      columnAdd.addEventListener('click', this.addInput);
      this.toAppoint();
    }
  }

  removeTask(event) {
    const task = event.target.closest('.task');
    const parent = event.target.closest('.tasks-list');
    parent.removeChild(task);
  }

  toAppoint() {
    const taskList = this.container.querySelectorAll('.task');
    [...taskList].forEach((el) => el.addEventListener('mouseover', this.mouseOver));
    [...taskList].forEach((el) => el.addEventListener('mouseleave', this.onTaskLeave));
    [...taskList].forEach((el) => el.addEventListener('mousedown', this.mouseDown));
  }

  mouseOver(event) {
    if (event.target.classList.contains('task') && !event.target.querySelector('.close')) {
      const closeEl = document.createElement('div');
      closeEl.classList.add('tasks-list__close');
      closeEl.classList.add('close');
      event.target.appendChild(closeEl);
      closeEl.style.top = `${closeEl.offsetTop - closeEl.offsetHeight / 2}px`;
      closeEl.style.left = `${
        event.target.offsetWidth - closeEl.offsetWidth - 3
      }px`;
      closeEl.addEventListener('click', this.removeTask);
    }
  }

  onTaskLeave(event) {
    event.target.removeChild(event.target.querySelector('.close'));
  }

  mouseDown(event) {
    if (event.target.classList.contains('task')) {
      this.draggedEl = event.target;
      this.ghostEl = event.target.cloneNode(true);
      this.ghostEl.removeChild(this.ghostEl.querySelector('.close'));
      this.ghostEl.classList.add('dragged');
      this.ghostEl.style.width = `${this.draggedEl.offsetWidth}px`;
      this.ghostEl.style.height = `${this.draggedEl.offsetHeight}px`;
      document.body.appendChild(this.ghostEl);
      const { top, left } = event.target.getBoundingClientRect();
      this.top = event.pageY - top;
      this.left = event.pageX - left;
      this.ghostEl.style.top = `${top - this.draggedEl.offsetHeight}px`;
      this.ghostEl.style.left = `${left - this.container.offsetWidth}px`;
      this.ghostEl.style.width = `${this.draggedEl.offsetWidth}px`;
      this.ghostEl.style.height = `${this.draggedEl.offsetHeight}px`;
      this.draggedEl.style.display = 'none';
      this.container.addEventListener('mousemove', this.dragMove);
      document.addEventListener('mousemove', this.showPossiblePlace);
      document.addEventListener('mouseup', this.mouseUp);
    }
  }

  dragMove(event) {
    event.preventDefault();
    if (!this.draggedEl) {
      return;
    }
    this.ghostEl.style.top = `${event.pageY - this.top}px`;
    this.ghostEl.style.left = `${event.pageX - this.left}px`;
  }

  mouseUp() {
    if (!this.draggedEl) {
      return;
    }
    this.newPlace.replaceWith(this.draggedEl);
    this.draggedEl.style.display = 'flex';
    document.body.removeChild(document.body.querySelector('.dragged'));
    this.ghostEl = null;
    this.draggedEl = null;
  }

  showPossiblePlace(event) {
    event.preventDefault();
    if (!this.draggedEl) {
      return;
    }
    const closestColumn = event.target.closest('.tasks-list');
    if (closestColumn) {
      const allTasks = closestColumn.querySelectorAll('.task');
      const allPos = [closestColumn.getBoundingClientRect().top];
      if (allTasks) {
        for (const item of allTasks) {
          allPos.push(item.getBoundingClientRect().top + item.offsetHeight / 2);
        }
      }
      if (!this.newPlace) {
        this.newPlace = document.createElement('div');
        this.newPlace.classList.add('task-list__new-place');
      }
      this.newPlace.style.width = `${this.ghostEl.offsetWidth}px`;
      this.newPlace.style.height = `${this.ghostEl.offsetHeight}px`;
      const itemIndex = allPos.findIndex((item) => item > event.pageY);
      if (itemIndex !== -1) {
        closestColumn.insertBefore(this.newPlace, allTasks[itemIndex - 1]);
      } else {
        closestColumn.appendChild(this.newPlace);
      }
    }
  }
}

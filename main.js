(()=>{"use strict";class t{constructor(t,s){this.parent=t,this.task=s}addTask(){const t=document.createElement("div");t.classList.add("tasks-list__item"),t.classList.add("task"),t.textContent=this.task,this.parent.appendChild(t)}}(new class{constructor(){this.container=null,this.tasksTodo=[],this.tasksProgress=[],this.tasksDone=[],this.tasks=[this.tasksTodo,this.tasksProgress,this.tasksDone],this.addInput=this.addInput.bind(this),this.closeForm=this.closeForm.bind(this),this.addNewTask=this.addNewTask.bind(this),this.mouseOver=this.mouseOver.bind(this),this.removeTask=this.removeTask.bind(this),this.saveState=this.saveState.bind(this),this.update=this.update.bind(this),this.mouseDown=this.mouseDown.bind(this),this.dragMove=this.dragMove.bind(this),this.mouseUp=this.mouseUp.bind(this),this.drawPushedCards=this.drawPushedCards.bind(this),this.showPossiblePlace=this.showPossiblePlace.bind(this)}init(){this.update(),this.drawUI(),this.drawPushedCards(),this.clickAddBtn(),window.addEventListener("beforeunload",this.saveState)}update(){this.tasks=JSON.parse(localStorage.getItem("tasks"))}saveState(){this.tasksTodo=[],this.tasksProgress=[],this.tasksDone=[];const t=this.container.querySelector(".todo"),s=this.container.querySelector(".in-progress"),e=this.container.querySelector(".done"),i=[...t.querySelectorAll(".task")],a=[...s.querySelectorAll(".task")],d=[...e.querySelectorAll(".task")];i.forEach((t=>this.tasksTodo.push(t.textContent))),a.forEach((t=>this.tasksProgress.push(t.textContent))),d.forEach((t=>this.tasksDone.push(t.textContent))),this.tasks=[this.tasksTodo,this.tasksProgress,this.tasksDone],localStorage.setItem("tasks",JSON.stringify(this.tasks))}clickAddBtn(){[...this.container.querySelectorAll(".btn-add")].forEach((t=>t.addEventListener("click",this.addInput)))}drawUI(){this.container=document.createElement("div"),this.container.classList.add("container"),this.container.innerHTML='<div class="card">\n    <h2 class="title">todo</h2>\n    <div class="tasks-list todo"></div>\n    <div class="btn-add">+ Add another card</div>\n  </div>\n  <div class="card">\n    <h2 class="title">in progress</h2>\n    <div class="tasks-list in-progress" id="trew"></div>\n    <div class="btn-add">+ Add another card</div>\n  </div>\n  <div class="card">\n    <h2 class="title">done</h2>\n    <div class="tasks-list done"></div>\n    <div class="btn-add">+ Add another card</div>\n  </div>',document.querySelector("body").append(this.container)}drawPushedCards(){const s=[".todo",".in-progress",".done"];for(let e=0;e<s.length;e+=1){const i=this.container.querySelector(s[e]);this.tasks[e].forEach((s=>{new t(i,s).addTask(),0===e&&this.tasksTodo.push(s),1===e&&this.tasksProgress.push(s),2===e&&this.tasksDone.push(s)})),this.toAppoint()}}addInput(t){const s=document.createElement("form");s.classList.add("card-form"),s.innerHTML='\n    <textarea class="textarea" type ="text" placeholder="Enter a title for this card"></textarea>\n    <div class="buttons">\n      <button class="add-card-btn buttons">Add Card</button>\n      <button class="close-form-btn buttons">Close</button>\n    </div>\n ';const e=t.target.closest(".card");t.target.replaceWith(s);const i=e.querySelector(".add-card-btn"),a=e.querySelector(".close-form-btn");i.addEventListener("click",this.addNewTask),a.addEventListener("click",this.closeForm)}closeForm(t){t.preventDefault();const s=document.createElement("div");s.classList.add("btn-add"),s.textContent="+ Add another card";const e=t.target.closest(".card"),i=e.querySelector(".card-form");e.removeChild(i),e.appendChild(s),s.addEventListener("click",this.addInput)}addNewTask(s){s.preventDefault();const e=s.target.closest(".card"),i=e.querySelector(".tasks-list"),a=e.querySelector(".textarea").value;if(a){new t(i,a).addTask();const s=document.createElement("div");s.classList.add("btn-add"),s.textContent="+ Add another card",e.removeChild(e.querySelector(".card-form")),e.appendChild(s),s.addEventListener("click",this.addInput),this.toAppoint()}}removeTask(t){const s=t.target.closest(".task");t.target.closest(".tasks-list").removeChild(s)}toAppoint(){const t=this.container.querySelectorAll(".task");[...t].forEach((t=>t.addEventListener("mouseover",this.mouseOver))),[...t].forEach((t=>t.addEventListener("mouseleave",this.onTaskLeave))),[...t].forEach((t=>t.addEventListener("mousedown",this.mouseDown)))}mouseOver(t){if(t.target.classList.contains("task")&&!t.target.querySelector(".close")){const s=document.createElement("div");s.classList.add("tasks-list__close"),s.classList.add("close"),t.target.appendChild(s),s.style.top=s.offsetTop-s.offsetHeight/2+"px",s.style.left=t.target.offsetWidth-s.offsetWidth-3+"px",s.addEventListener("click",this.removeTask)}}onTaskLeave(t){t.target.removeChild(t.target.querySelector(".close"))}mouseDown(t){if(t.target.classList.contains("task")){this.draggedEl=t.target,this.ghostEl=t.target.cloneNode(!0),this.ghostEl.removeChild(this.ghostEl.querySelector(".close")),this.ghostEl.classList.add("dragged"),this.ghostEl.style.width=`${this.draggedEl.offsetWidth}px`,this.ghostEl.style.height=`${this.draggedEl.offsetHeight}px`,document.body.appendChild(this.ghostEl);const{top:s,left:e}=t.target.getBoundingClientRect();this.top=t.pageY-s,this.left=t.pageX-e,this.ghostEl.style.top=s-this.draggedEl.offsetHeight+"px",this.ghostEl.style.left=e-this.container.offsetWidth+"px",this.ghostEl.style.width=`${this.draggedEl.offsetWidth}px`,this.ghostEl.style.height=`${this.draggedEl.offsetHeight}px`,this.draggedEl.style.display="none",this.container.addEventListener("mousemove",this.dragMove),document.addEventListener("mousemove",this.showPossiblePlace),document.addEventListener("mouseup",this.mouseUp)}}dragMove(t){t.preventDefault(),this.draggedEl&&(this.ghostEl.style.top=t.pageY-this.top+"px",this.ghostEl.style.left=t.pageX-this.left+"px")}mouseUp(){this.draggedEl&&(this.newPlace.replaceWith(this.draggedEl),this.draggedEl.style.display="flex",document.body.removeChild(document.body.querySelector(".dragged")),this.ghostEl=null,this.draggedEl=null)}showPossiblePlace(t){if(t.preventDefault(),!this.draggedEl)return;const s=t.target.closest(".tasks-list");if(s){const e=s.querySelectorAll(".task"),i=[s.getBoundingClientRect().top];if(e)for(const t of e)i.push(t.getBoundingClientRect().top+t.offsetHeight/2);this.newPlace||(this.newPlace=document.createElement("div"),this.newPlace.classList.add("task-list__new-place")),this.newPlace.style.width=`${this.ghostEl.offsetWidth}px`,this.newPlace.style.height=`${this.ghostEl.offsetHeight}px`;const a=i.findIndex((s=>s>t.pageY));-1!==a?s.insertBefore(this.newPlace,e[a-1]):s.appendChild(this.newPlace)}}}).init()})();
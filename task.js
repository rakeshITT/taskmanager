document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  motoQuote();
});

console.log(document.body.innerHTML.includes('id="task"'));



/*ADD TASK */

const addButton = document.getElementById("add-button");
const outputContainer = document.querySelector(".output-container");

addButton.addEventListener("click", addTask);
addButton.addEventListener("keypress", function(e) {
    if(e.key === "Enter"){
        addTask();
    }

})

function addTask(){
const taskInput = document.getElementById("task");
// console.log(taskInput.value);

    const taskText = taskInput.value.trim();            // text of task
        
     const taskId = Date.now();
     const task = { id: taskId, text: taskText, completed: false };
        if(taskText === "") {
            alert("Enter the task");
            return;
        }      
        
        createDomElement(taskId, taskText);
        saveTasks(taskId, taskText);

        taskInput.value  = ""; 
}


function createDomElement(taskId, taskText, completed=false){

     const li = document.createElement("li");
     li.classList.add("li");

     const span = document.createElement("span");
     span.classList.add("task-text");
     span.textContent = taskText;

     const checkBox = document.createElement("input");
    //  console.log(checkBox);

     checkBox.type ="checkbox";
     checkBox.checked = completed;
     checkBox.addEventListener("change", () => toggleCompleted(taskId));
    //  console.log(checkBox);

    li.appendChild(checkBox); 
    li.appendChild(span);
     
     
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-btn task-buttons";
      editBtn.onclick = () => editTask(span, taskId);                                   /** onclick is a property*/
      li.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn ";
      deleteBtn.onclick = () => deleteTask(li, taskId);
      li.appendChild(deleteBtn);

    
  document.querySelector(".task-list").appendChild(li);
}


// save the added task 
function saveTasks(id, task){

    let tasks  =  JSON.parse(localStorage.getItem("tasks")) || {};
    console.log(tasks);                                                      //
    
    tasks[id]= { id, task, completed: false };
    localStorage.setItem("tasks", JSON.stringify(tasks));

}

/* load task*/ 

function loadTasks (){

motoQuote();

const taskList = document.querySelector(".task-list");
taskList.innerHTML = "";

const tasks  = JSON.parse(localStorage.getItem("tasks")) || {};
for (let [id, taskObj] of Object.entries(tasks)) {
createDomElement(Number(id), taskObj.task, taskObj.completed);
}
}


function deleteTask(li, taskId){
        li.remove();

        let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
        delete tasks[taskId];
        localStorage.setItem("tasks", JSON.stringify(task));

    }

function editTask(span, taskId){
        
        const newTask = prompt("Edit the task:", span.textContent);

        if(newTask && newTask.trim() !==""){                                                    /** since prompt is browser method user clicks cacnel it return null hecne */
            span.textContent = newTask.trim();
        }

        let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
        tasks[taskId].text = newTask.trim();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        
    }

/** search button */
   
    const searchInput = document.getElementById("task");
    console.log(searchInput )  
  
    searchInput.addEventListener("input", () => {
        const findTaskText= searchInput.value.trim().toLowerCase();
        console.log(findTaskText);
        document.querySelectorAll(".li").forEach((task)=>{
            console.log(task);
            const taskText = task.querySelector(".task-text")?.textContent.toLowerCase() || "";
            console.log(taskText)

            if (taskText === findTaskText) {
            task.classList.add("highlight"); 
            
            } else {
            task.classList.remove("highlight");
            }        
    })
 })

/** filter  */

function toggleCompleted(taskId) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
  console.log(tasks);
   if(tasks[taskId]) {
        tasks[taskId].completed = !tasks[taskId].completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    }
}


function showCompletedTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || {};
  let completedTasks = tasks.filter(task => task.completed === true);
  console.log(completedTasks);
}



// Attach filter listeners
document.getElementById("filter-all").addEventListener("change", () => filterTasks("all"));
document.getElementById("filter-completed").addEventListener("change", () => filterTasks("completed"));
document.getElementById("filter-pending").addEventListener("change", () => filterTasks("pending"));

function filterTasks(type) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || {};

  // Convert to array for filtering
  let filteredTasks = Object.values(tasks);

  if (type === "completed") {
    filteredTasks = filteredTasks.filter(task => task.completed);
  } else if (type === "pending") {
    filteredTasks = filteredTasks.filter(task => !task.completed);
  }

  // Clear the current list
  document.querySelector(".task-list").innerHTML = "";

  // Re-render based on filtered list
  filteredTasks.forEach(task => createDomElement(task.id, task.task, task.completed));
}


/** moto quotes */

async function motoQuote() {
    const container = document.getElementById("quote-container");
    console.log(container);
    
    try {
        const response = await fetch('https://dummyjson.com/quotes/random');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const quote = await response.json();
        
        document.getElementById("quote-text").textContent = `"${quote.quote}"`;
        document.getElementById("quote-author").textContent = `— ${quote.author}`;
        
    } catch (error) {
        console.error('Error fetching quote:', error);
        
        container.innerHTML = `
            <div class="quote-text">"The way to get started is to quit talking and begin doing."</div>
            <div class="quote-author">— Walt Disney</div>
        `;
    }
}



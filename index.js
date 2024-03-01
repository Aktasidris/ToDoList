document.addEventListener("DOMContentLoaded", () => {
  const addTaskForm = document.getElementById("add-task-form");
  const taskInput = document.getElementById("task-input");
  const tasksContainer = document.getElementById("task-list-container");

  // Görevleri yükleyen fonksiyon
  function loadTasks() {
    fetch("http://localhost:3000/tasks")
      .then((response) => response.json())
      .then((tasks) => {
        tasksContainer.innerHTML = ""; // Mevcut görevleri temizle
        tasks.forEach((task) => {
          addTaskToDOM(task); // Her görevi DOM'a ekle
        });
      })
      .catch((error) => console.error("Hata:", error));
  }

  // Form submit olayı
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskContent = taskInput.value.trim();
    if (taskContent) {
      createTask(taskContent);
    }
  });

  // Yeni görev oluştur
  function createTask(content) {
    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Görev",
        author: "Kullanıcı",
        content: content,
        state: "active",
      }),
    })
      .then((response) => response.json())
      .then((task) => {
        addTaskToDOM(task); // Yeni görevi DOM'a ekle
        taskInput.value = ""; // Input alanını temizle
      })
      .catch((error) => console.error("Hata:", error));
  }

  // Görevleri DOM'a ekle
  function addTaskToDOM(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task-item");

    const taskContent = document.createElement("div");
    taskContent.classList.add("task-content");
    taskContent.textContent = task.content;
    taskElement.appendChild(taskContent);

    // "Done" butonu
    const doneButton = document.createElement("button");
    doneButton.innerText = "Done";
    doneButton.addEventListener("click", () =>
      updateTaskState(task.id, task.state === "active" ? "done" : "active")
    );

    // "Delete" butonu
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    const actionsContainer = document.createElement("div");
    actionsContainer.classList.add("task-actions");
    actionsContainer.appendChild(doneButton);
    actionsContainer.appendChild(deleteButton);

    taskElement.appendChild(actionsContainer);

    if (task.state === "done") {
      taskElement.classList.add("done");
    }

    tasksContainer.appendChild(taskElement);
  }

  // Görev durumunu güncelle
  window.updateTaskState = function (taskId, newState) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: newState }),
    })
      .then(() => loadTasks())
      .catch((error) => console.error("Hata:", error));
  };

  // Görevi sil
  window.deleteTask = function (taskId) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then(() => loadTasks())
      .catch((error) => console.error("Hata:", error));
  };

  loadTasks();
});

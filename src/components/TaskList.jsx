// src/components/TaskList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  const [editedTaskCompleted, setEditedTaskCompleted] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response ? error.response.data : error.message);
    }
  };

  const addTask = async (title) => {
    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/todos", {
        title,
        completed: false,
      });

      // JSONPlaceholder doesn’t actually save new tasks, so we manage it locally
      setTasks([...tasks, { ...response.data, id: Math.floor(Math.random() * 200) + 1 }]);
    } catch (error) {
      console.error("Error adding task:", error.response ? error.response.data : error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error.response ? error.response.data : error.message);
    }
  };

  const toggleComplete = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) {
      console.error(`Task with ID ${id} not found`);
      return;
    }

    console.log("Updating task:", taskToUpdate);

    try {
      if (id > 200) {
        // If the task is locally added, update state without an API call
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        );
      } else {
        const response = await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
          ...taskToUpdate,
          completed: !taskToUpdate.completed,
        });

        console.log("Response:", response.data);
        setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
      }
    } catch (error) {
      console.error("Error updating task:", error.response ? error.response.data : error.message);
    }
  };

  const startEditing = (id, title, completed) => {
    setEditingTaskId(id);
    setEditedTaskTitle(title);
    setEditedTaskCompleted(completed);
  };

  const saveEditedTask = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) {
      console.error(`Task with ID ${id} not found`);
      return;
    }

    console.log("Saving edited task:", { id, title: editedTaskTitle, completed: editedTaskCompleted });

    try {
      if (id > 200) {
        // Locally update the UI if task is not in JSONPlaceholder's valid range
        setTasks(
          tasks.map((task) =>
            task.id === id
              ? { ...task, title: editedTaskTitle, completed: editedTaskCompleted }
              : task
          )
        );
      } else {
        const response = await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
          ...taskToUpdate,
          title: editedTaskTitle,
          completed: editedTaskCompleted,
        });

        console.log("Response:", response.data);
        setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
      }

      setEditingTaskId(null);
    } catch (error) {
      console.error("Error saving task:", error.response ? error.response.data : error.message);
    }
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  return (
    <div>
      <TaskForm addTask={addTask} />
      <ul style={styles.taskList}>
        {tasks.map((task) => (
          <li key={task.id} style={styles.taskItem}>
            {editingTaskId === task.id ? (
              <div style={styles.editForm}>
                <input
                  type="text"
                  value={editedTaskTitle}
                  onChange={(e) => setEditedTaskTitle(e.target.value)}
                  style={styles.editInput}
                  autoFocus
                />
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={editedTaskCompleted}
                    onChange={(e) => setEditedTaskCompleted(e.target.checked)}
                    style={styles.checkbox}
                  />
                  Completed
                </label>
                <button onClick={() => saveEditedTask(task.id)} style={styles.saveButton}>
                  Save
                </button>
                <button onClick={cancelEditing} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div style={styles.taskContent}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    style={styles.checkbox}
                  />
                  <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
                    {task.title}
                  </span>
                </div>
                <div style={styles.actions}>
                  <button
                    onClick={() => startEditing(task.id, task.title, task.completed)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteTask(task.id)} style={styles.deleteButton}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  taskList: {
    listStyle: "none",
    padding: "0",
  },
  taskItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  taskContent: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: "1",
  },
  checkbox: {
    marginRight: "10px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    marginRight: "10px",
  },
  editForm: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: "1",
  },
  editInput: {
    flex: "1",
    padding: "5px",
    fontSize: "16px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#000",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default TaskList;

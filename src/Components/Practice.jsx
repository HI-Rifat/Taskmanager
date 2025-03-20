import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false); // Add a flag

    useEffect(() => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            try {
                const parsedTasks = JSON.parse(savedTasks);
                if (Array.isArray(parsedTasks)) {
                    setTasks(parsedTasks);
                } else {
                    console.warn("Saved tasks are not an array. Ignoring the data.");
                }
            } catch (error) {
                console.error("Error parsing saved tasks:", error);
            }
        }
        setIsLoaded(true); // Mark as loaded after attempting to retrieve tasks
    }, []);

    useEffect(() => {
        if (isLoaded) { // Only save to localStorage after initial load
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }, [tasks, isLoaded]);

    const addTask = useCallback(() => {
        if (task.trim() !== "") {
            setLoading(true);
            const newTask = {
                id: Date.now(),
                text: task,
                description,
                dueDate,
                priority,
                status,
                isDone: false,
                isEditing: false,
            };
            setTimeout(() => {
                setTasks((prevTasks) => [...prevTasks, newTask]);
                setTask("");
                setDescription("");
                setDueDate("");
                setPriority("");
                setStatus("");
                setLoading(false);
            }, 300);
        }
    }, [task, description, dueDate, priority, status]);

    const toggleDone = useCallback((id) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t))
        );
    }, []);

    const toggleEdit = useCallback((id) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === id ? { ...t, isEditing: !t.isEditing } : t))
        );
    }, []);

    const saveEdit = useCallback((id, newText, newDescription, newDueDate, newPriority, newStatus) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) =>
                t.id === id
                    ? { ...t, text: newText, description: newDescription, dueDate: newDueDate, priority: newPriority, status: newStatus, isEditing: false }
                    : t
            )
        );
    }, []);

    const deleteTask = useCallback((id) => {
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    }, []);

    const handleTaskSelection = (id) => {
        setSelectedTasks((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((taskId) => taskId !== id)
                : [...prevSelected, id]
        );
    };

    const deleteSelectedTasks = () => {
        setTasks((prevTasks) => prevTasks.filter((t) => !selectedTasks.includes(t.id)));
        setSelectedTasks([]);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4"></h2>
            <button onClick={deleteSelectedTasks} className="btn btn-danger mb-3" disabled={selectedTasks.length === 0}>
                Delete Selected
            </button>
            <div className="row">
                <div className="col-md-4">
                    <div className="card mb-4" style={{ backgroundColor: "#b2e9f7" }}>
                        <div className="card-header">Add New Task</div>
                        <div className="card-body">
                            <input id="title" type="text" value={task} onChange={(e) => setTask(e.target.value)} placeholder="Task Title" className="form-control mb-2" />
                            <textarea id="description"value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task Description" className="form-control mb-2" />
                            <input type="date" id="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="form-control mb-2" />
                            <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="form-select mb-2">
                            <option value="" disabled selected hidden>Choose Priority</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="form-select mb-2">
                                <option value="" disabled selected hidden>Choose Status</option>
                                <option value="Pending">To-Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <button onClick={addTask} className={`btn ${loading ? "btn-secondary" : "btn-primary"} w-100`} disabled={loading}>
                                {loading ? "Loading..." : "Add Task"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="list-group">
                        {tasks.map((t) => (
                            <div key={t.id} className={`list-group-item ${t.isDone ? "bg-success text-white" : ""}`}>
                                <input type="checkbox" onChange={() => handleTaskSelection(t.id)} checked={selectedTasks.includes(t.id)} className="me-2" />
                                {t.isEditing ? (
                                    <>
                                        <input
                  type="text"
                  defaultValue={t.text}
                  onChange={(e) => (t.text = e.target.value)}
                  className="form-control mb-2"
                />
                <textarea
                  defaultValue={t.description}
                  onChange={(e) => (t.description = e.target.value)}
                  className="form-control mb-2"
                />
                <input
                  type="date"
                  defaultValue={t.dueDate}
                  onChange={(e) => (t.dueDate = e.target.value)}
                  className="form-control mb-2"
                />
                <select
                  defaultValue={t.priority}
                  onChange={(e) => (t.priority = e.target.value)}
                  className="form-select mb-2"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select
                  defaultValue={t.status}
                  onChange={(e) => (t.status = e.target.value)}
                  className="form-select mb-2"
                >
                  <option value="Pending">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button
                  onClick={() =>
                    saveEdit(
                      t.id,
                      t.text,
                      t.description,
                      t.dueDate,
                      t.priority,
                      t.status
                    )
                  }
                  className="btn btn-primary btn-sm"
                >
                  Save
                </button>
                                    </>
                                ) : (
                                    <>
                                        <h5>{t.text}</h5>
                                        <p>{t.description}</p>
                                        <small>Due: {t.dueDate || "No Date"}</small>
                                        <p>Priority: <strong>{t.priority}</strong></p>
                                        <p>Status: <strong>{t.status}</strong></p>
                                        <div>
                                            <button onClick={() => toggleDone(t.id)} className="btn btn-sm btn-primary me-2">{t.isDone ? "Undo" : "Complete"}</button>
                                            <button onClick={() => toggleEdit(t.id)} className="btn btn-sm btn-warning me-2">Edit</button>
                                            <button onClick={() => deleteTask(t.id)} className="btn btn-sm btn-danger">Delete</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskManager;

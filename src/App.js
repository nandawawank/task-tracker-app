import { useState, useEffect } from "react";
import Header from './component/Header';
import Tasks from './component/Tasks';
import AddTask from './component/AddTask';
import {bool} from "prop-types";

function App() {
    const [showAddTask, setShowAddTask] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const getTask = async () => {
            const taskFromSsrver = await fetchTasks();
            setTasks(taskFromSsrver);
        }

        getTask();
    }, [])

    const fetchTasks =  async () => {
        const res = await fetch('http://localhost:5000/tasks')
        const data = await res.json();

        return data;
    }

    const fetchTask =  async (id) => {
        const res = await fetch(`http://localhost:5000/tasks/${id}`)
        const data = await res.json();

        return data;
    }

    const addTask = async (task) => {
        const res = await fetch(`http://localhost:5000/tasks`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(task)
        })

        const data = res.json();

        setTasks([...tasks, data])

        // const id = Math.floor(Math.random() * 1000) + 1;
        //
        // const newTask = { id, ...task };
        // setTasks([...tasks, newTask]);
    }

    const deleteTask = async (id) => {
        await fetch(`http://localhost:5000/tasks/${id}`,{ method: 'DELETE' });

        setTasks(tasks.filter((task) => task.id !== id));
    }

    const toggleReminder = async (id) => {
        const taskToToggle = await fetchTask(id);
        const upTask = {...taskToToggle, rimender: !taskToToggle.remider}

        const res = await fetch(`http://localhost:5000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(upTask)
        })

        const data = await res.json();

        setTasks(tasks.map((task) => task.id === id ? {...task, remider: !task.remider } : task))
    }

    return (
        <div className='container'>
            <Header
                onAdd={() => setShowAddTask(!showAddTask)}
                showAdd={showAddTask} />
            {showAddTask && <AddTask onAdd={addTask}/>}
            {
                tasks.length < 1 ? 'No Tasks to Show' :
                    <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>
            }
        </div>
    );
}

export default App;

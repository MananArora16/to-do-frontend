import useSWR from 'swr';
import React, { useState } from 'react';
import CreateTask from '../Modals/createTask';
import Card from './Card';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TodoList = () => {
    const [modal, setModal] = useState(false);
    const [taskList, setTaskList] = useState();

    const getTodos = async () => {
        const res = await fetch('http://localhost:1234');
        const data = await res.json();
        return data.data;
    };

    const { data, mutate, isValidating } = useSWR('/todo', getTodos);

    const deleteTask = async (id) => {
        const res = await fetch('http://localhost:1234', {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
            }),
        });
        const data = await res.json();
        if (!data.error) {
            mutate('/todo');
        }
    };

    const updateListArray = async ({ name, description }, index) => {
        const res = await fetch('http://localhost:1234', {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: index,
                name,
                description,
            }),
        });
        const data = await res.json();
        if (!data.error) {
            mutate('/todo');
        }
        toast.error(data.reason);
        setModal(false);
    };

    const toggle = () => {
        setModal(!modal);
    };

    const saveTask = async ({ name, description }) => {
        const res = await fetch('http://localhost:1234', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description,
            }),
        });
        const data = await res.json();
        if (!data.error) {
            mutate('/todo');
        }
        toast.error(data.reason);
        setModal(false);
    };

    return (
        <>
            <div className='header text-center'>
                <h3>Todo List</h3>
                <button
                    className='btn btn-primary mt-2'
                    onClick={() => setModal(true)}
                >
                    Create Task
                </button>
            </div>
            <div className='task-container'>
                {data !== undefined &&
                    !isValidating &&
                    data.map((obj, key) => (
                        <Card
                            key={key}
                            taskObj={obj}
                            index={key}
                            deleteTask={deleteTask}
                            updateListArray={updateListArray}
                        />
                    ))}
            </div>
            <CreateTask toggle={toggle} modal={modal} save={saveTask} />
            <ToastContainer
                position='bottom-right'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
            />
        </>
    );
};

export default TodoList;

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');
    
    useEffect(() => {
        // Load todos from localStorage on initial render
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    useEffect(() => {
        // Save todos to localStorage whenever they change
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (input.trim()) {
            setTodos([...todos, {
                id: Date.now(),
                text: input.trim(),
                completed: false
            }]);
            setInput('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div className="app">
            <h1>Todo List</h1>
            <div className="todo-container">
                <div className="input-container">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Add a new todo"
                        className="todo-input"
                    />
                    <button 
                        onClick={addTodo}
                        className="add-btn"
                    >
                        Add
                    </button>
                </div>
                <div className="todo-list">
                    {todos.map(todo => (
                        <div 
                            key={todo.id}
                            className={`todo-item ${todo.completed ? 'completed' : ''}`}
                        >
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo.id)}
                                className="todo-checkbox"
                            />
                            <span 
                                className="todo-text"
                                onClick={() => toggleTodo(todo.id)}
                            >
                                {todo.text}
                            </span>
                            <button 
                                onClick={() => deleteTodo(todo.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
                <div className="todo-footer">
                    <span className="todo-count">
                        {todos.filter(todo => !todo.completed).length} items remaining
                    </span>
                </div>
            </div>
        </div>
    );
}

export default App;
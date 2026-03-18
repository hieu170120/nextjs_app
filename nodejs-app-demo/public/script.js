let todos = [];
let completedCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    
    document.getElementById('addBtn').addEventListener('click', addTodo);
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});

async function loadTodos() {
    try {
        const response = await fetch('/todos');
        todos = await response.json();
        
        todos = todos.map(todo => ({
            ...todo,
            completed: todo.completed || false
        }));
        
        renderTodos();
        updateStats();
    } catch (error) {
        console.error('Lỗi khi tải công việc:', error);
        showError();
    }
}

function renderTodos() {
    const todosList = document.getElementById('todosList');
    
    if (todos.length === 0) {
        todosList.innerHTML = `
            <div class="empty-state">
                <h3>Chưa có công việc nào</h3>
                <p>Hãy thêm công việc đầu tiên của bạn!</p>
            </div>
        `;
        return;
    }
    
    todosList.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
            <input 
                type="checkbox" 
                class="todo-checkbox"
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.task)}</span>
            <div class="todo-actions">
                <button class="btn-delete" onclick="deleteTodo(${todo.id})">Xóa</button>
            </div>
        </div>
    `).join('');
}

async function addTodo() {
    const input = document.getElementById('todoInput');
    const task = input.value.trim();
    
    if (!task) {
        alert('Vui lòng nhập nội dung công việc!');
        return;
    }
    
    try {
        const response = await fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task })
        });
        
        const newTodo = await response.json();
        todos.push(newTodo);
        
        input.value = '';
        renderTodos();
        updateStats();
        
        animateNewTodo(newTodo.id);
    } catch (error) {
        console.error('Lỗi khi thêm công việc:', error);
        alert('Không thể thêm công việc. Vui lòng thử lại!');
    }
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        updateStats();
        
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        if (todo.completed) {
            todoItem.classList.add('completed');
        } else {
            todoItem.classList.remove('completed');
        }
    }
}

async function deleteTodo(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
        return;
    }
    
    try {
        await fetch(`/todos/${id}`, {
            method: 'DELETE'
        });
        
        todos = todos.filter(t => t.id !== id);
        renderTodos();
        updateStats();
    } catch (error) {
        console.error('Lỗi khi xóa công việc:', error);
        alert('Không thể xóa công việc. Vui lòng thử lại!');
    }
}

function updateStats() {
    completedCount = todos.filter(t => t.completed).length;
    document.getElementById('totalTodos').textContent = todos.length;
    document.getElementById('completedTodos').textContent = completedCount;
}

function animateNewTodo(id) {
    setTimeout(() => {
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'slideIn 0.3s ease-out';
            }, 10);
        }
    }, 50);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError() {
    const todosList = document.getElementById('todosList');
    todosList.innerHTML = `
        <div class="empty-state">
            <h3>Không thể tải dữ liệu</h3>
            <p>Vui lòng kiểm tra kết nối và thử lại!</p>
        </div>
    `;
}

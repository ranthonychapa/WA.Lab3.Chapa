let students = [];
let nextId   = 4;
let searchTerm = '';
let sortMode   = '';

function getFiltered() {
    let list = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortMode === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortMode === 'age')  list.sort((a, b) => a.age - b.age);
    return list;
}

function render(highlightId = null) {
    const filtered = getFiltered();
    const tbody = document.getElementById('tableBody');

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4"><div class="no-results">No students found matching "<strong>${searchTerm}</strong>"</div></td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(s => `
        <tr${s.id === highlightId ? ' class="new-row"' : ''}>
            <td style="color:#999;font-size:0.82rem">${s.id}</td>
            <td><strong>${s.name}</strong></td>
            <td>${s.age}</td>
            <td><span class="badge">${s.course.toUpperCase()}</span></td>
        </tr>
    `).join('');
}

function clearErrors() {
    ['Name', 'Age', 'Course'].forEach(f => {
        document.getElementById('err' + f).textContent = '';
        document.getElementById('input' + f).classList.remove('invalid');
    });
}

function setErr(field, msg) {
    document.getElementById('err' + field).textContent = msg;
    document.getElementById('input' + field).classList.add('invalid');
}

function validate(name, age, course) {
    let ok = true;
    clearErrors();
    if (!name.trim()) { setErr('Name', 'Name is required.'); ok = false; }
    else if (/\d/.test(name)) { setErr('Name', 'Name must not contain digits.'); ok = false; }

    const ageNum = Number(age);
    if (age === '') { setErr('Age', 'Age is required.'); ok = false; }
    else if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 99) { setErr('Age', 'Age must be a valid number (1–99).'); ok = false; }

    if (!course.trim()) { setErr('Course', 'Course is required.'); ok = false; }
    return ok;
}

function clearForm() {
    ['inputName', 'inputAge', 'inputCourse'].forEach(id =>
        document.getElementById(id).value = ''
    );
    clearErrors();
}

function loadData() {
    return Promise.resolve([
        { "id": 1, "name": "John", "age": 21, "course": "CS" },
        { "id": 2, "name": "Jim", "age": 22, "course": "IT" },
        { "id": 3, "name": "Joe", "age": 20, "course": "SE" }
    ]);
}

document.getElementById('searchInput').addEventListener('input', e => {
    searchTerm = e.target.value;
    render();
});

document.getElementById('sortSelect').addEventListener('change', e => {
    sortMode = e.target.value;
    render();
});

document.getElementById('addBtn').addEventListener('click', () => {
    const name   = document.getElementById('inputName').value;
    const age    = document.getElementById('inputAge').value;
    const course = document.getElementById('inputCourse').value;

    if (!validate(name, age, course)) return;

    const newStudent = {
        id: nextId++,
        name: name.trim(),
        age: Number(age),
        course: course.trim().toUpperCase()
    };
    students.push(newStudent);
    render(newStudent.id);
    clearForm();
});

document.getElementById('clearBtn').addEventListener('click', clearForm);

loadData().then(data => {
    students = data;
    render();
});
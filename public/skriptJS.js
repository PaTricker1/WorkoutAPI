const predefinedExercises = [
            "Bench", "Bench dumbells", "Seated push", "Chest fly", "Triceps pushdown",
            "Seated dip", "Lateral raise", "Shoulder press", "Pullup", "Pulldown",
            "Lat row", "Bent over row", "Cable curl", "Front raise", "Rear delt raise",
            "Squat", "Quad extension", "Ham curl", "Calf raise", "Hip abduction", 
            "Hip adduction", "Deadlift", "Dip"
        ];

        let previousData = [];

        function generateTable() {
            const rowCount = parseInt(document.getElementById('rowCount').value);
            const table = document.getElementById('workoutTable');
            table.innerHTML = '';

            const header = document.createElement('tr');
            const headers = [
                'Date', 'Exercise Name', 'Rep1', 'Weight1', 'Rep2', 'Weight2',
                'Rep3', 'Weight3', 'Rep4', 'Weight4'
            ];
            for (let headerText of headers) {
                const th = document.createElement('th');
                th.innerText = headerText;
                header.appendChild(th);
            }
            table.appendChild(header);

            const data = previousData.slice(0, rowCount);

            for (let i = 0; i < rowCount; i++) {
                const row = document.createElement('tr');

                const dateCell = document.createElement('td');
                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.value = data[i] ? data[i][0] : new Date().toISOString().split('T')[0];
                dateInput.addEventListener('input', saveData);
                dateCell.appendChild(dateInput);
                row.appendChild(dateCell);

                const exerciseCell = document.createElement('td');
                const exerciseSelect = document.createElement('select');
                predefinedExercises.forEach(exercise => {
                    const option = document.createElement('option');
                    option.value = exercise;
                    option.textContent = exercise;
                    exerciseSelect.appendChild(option);
                });
                exerciseSelect.value = data[i] ? data[i][1] : predefinedExercises[0];
                exerciseSelect.addEventListener('change', saveData);
                exerciseCell.appendChild(exerciseSelect);
                row.appendChild(exerciseCell);

                for (let j = 0; j < 8; j++) {
                    const cell = document.createElement('td');
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = data[i] ? data[i][j + 2] : '';
                    input.placeholder = headers[j + 2];
                    input.addEventListener('input', saveData);
                    cell.appendChild(input);
                    row.appendChild(cell);
                }

                table.appendChild(row);
            }
        }

        function saveData() {
            const table = document.getElementById('workoutTable');
            const rows = table.querySelectorAll('tr');
            previousData = [];

            rows.forEach((row, rowIndex) => {
                if (rowIndex === 0) return;
                const cells = row.querySelectorAll('td input, td select');
                const rowData = [];
                cells.forEach(cell => {
                    const value = cell.value.trim();
                    rowData.push(value === "" ? "0" : value);
                });
                previousData.push(rowData);
            });
        }

        function sendDataToDatabase() {
            const confirmation = confirm("Are you sure you want to send the data?");
            if (!confirmation) {
                return;
            }

            const data = previousData;
            console.log('Sending data to the backend:', data);

            fetch('https://workoutapi-ul58.onrender.com/api/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                alert('Data successfully sent to the database!');
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
        }

        generateTable();

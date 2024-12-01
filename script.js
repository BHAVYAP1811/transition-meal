// Schedule Object (Stored in UTC)
const schedule = JSON.parse(localStorage.getItem('schedule')) || {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
};

// Detect User's Time Zone and Display
document.getElementById('timezone-display').innerText = `Your time zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;

// Convert Local Time to UTC
function convertToUTC(localTime) {
    const localDate = new Date(`1970-01-01T${localTime}:00`);
    return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[1]
        .slice(0, 5); // Return UTC time as HH:mm
}

// Convert UTC to Local Time
function convertToLocal(utcTime) {
    const utcDate = new Date(`1970-01-01T${utcTime}:00Z`);
    return utcDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

// Add Meal with Time Zone Awareness
function addMeal() {
    const day = document.getElementById("meal-day").value;
    const time = document.getElementById("meal-time").value; // User's local time
    const name = document.getElementById("meal-name").value;
    const photoInput = document.getElementById("meal-photo");
    const photo = photoInput.files[0];

    if (day && time && name && photo) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const meal = {
                time: convertToUTC(time), // Save time in UTC
                name,
                photo: e.target.result
            };
            schedule[day].push(meal);
            localStorage.setItem('schedule', JSON.stringify(schedule));
            alert(`Meal added to ${day}!`);
            document.getElementById("meal-form").reset();
        };
        reader.readAsDataURL(photo);
    } else {
        alert("Please fill in all fields.");
    }
}

// Load Schedule and Convert UTC to Local Time
function loadSchedule() {
    const container = document.getElementById("plan-container");
    container.innerHTML = '';
    for (const day in schedule) {
        const dayPlan = schedule[day];
        if (dayPlan.length > 0) {
            const daySection = document.createElement("div");
            daySection.innerHTML = `<h3>${day}</h3>`;
            dayPlan.forEach(meal => {
                const localTime = convertToLocal(meal.time); // Convert UTC to Local Time
                const mealItem = document.createElement("div");
                mealItem.innerHTML = `
                    <p>${localTime} - ${meal.name}</p>
                    <img src="${meal.photo}" alt="${meal.name}" style="width: 100px; height: 100px;">
                `;
                daySection.appendChild(mealItem);
            });
            container.appendChild(daySection);
        }
    }
}

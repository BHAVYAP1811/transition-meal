const schedule = JSON.parse(localStorage.getItem('schedule')) || {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
};

function addMeal() {
    const day = document.getElementById("meal-day").value;
    const time = document.getElementById("meal-time").value;
    const name = document.getElementById("meal-name").value;
    const photoInput = document.getElementById("meal-photo");
    const photo = photoInput.files[0];

    if (day && time && name && photo) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const meal = {
                time,
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

function loadSchedule() {
    const container = document.getElementById("plan-container");
    container.innerHTML = '';
    for (const day in schedule) {
        const dayPlan = schedule[day];
        if (dayPlan.length > 0) {
            const daySection = document.createElement("div");
            daySection.innerHTML = `<h3>${day}</h3>`;
            dayPlan.forEach(meal => {
                const mealItem = document.createElement("div");
                mealItem.innerHTML = `
                    <p>${meal.time} - ${meal.name}</p>
                    <img src="${meal.photo}" alt="${meal.name}" style="width: 100px; height: 100px;">
                `;
                daySection.appendChild(mealItem);
            });
            container.appendChild(daySection);
        }
    }
}

function exportToCalendar() {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n";
    for (const day in schedule) {
        schedule[day].forEach(meal => {
            icsContent += `
BEGIN:VEVENT
SUMMARY:${meal.name}
DESCRIPTION:Scheduled Meal
DTSTART:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}
DTEND:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}
END:VEVENT
`;
        });
    }
    icsContent += "END:VCALENDAR";
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "diet-plan.ics";
    link.click();
}

if (location.pathname.includes("view-plan.html")) {
    loadSchedule();
}

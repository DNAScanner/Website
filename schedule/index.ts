const dayElement = document.getElementById('day')!;
const lessonsElement = document.getElementById('lessons')!;

/*
Monday: History 2x, Biology 2x, Physics 2x, Sport 2x
Tuesday: Ethics 2x, English 2x, German 2x, Math 2x, Science 2x
Wednesday: Music 2x, French 2x, Economics 2x
Thursday: Math 1x, English 1x, Science 2x, Art 2x
Friday: French 1x, Math 1x, Chemistry 2x, German 2x
*/

const lessons = {
      monday: ["History", "History", "Biology", "Biology", "Physics", "Physics", "Sport", "Sport"],
      tuesday: ["Ethics", "Ethics", "English", "English", "German", "German", "Math", "Math", "Science", "Science"],
      wednesday: ["Music", "Music", "French", "French", "Economics", "Economics"],
      thursday: ["Math", "English", "Science", "Science", "Art", "Art"],
      friday: ["French", "Math", "Chemistry", "Chemistry", "German", "German"]
}

// Remove duplicates from each day's array
for (const day in lessons) {
      lessons[day] = [...new Set(lessons[day])];
}

// If the local time is after 8pm, show tomorrow's schedule
const weekdayToShow = new Date().getHours() >= 18 ? new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString('en-US', { weekday: 'long' }) : new Date().toLocaleDateString('en-US', { weekday: 'long' });

dayElement.innerHTML = weekdayToShow;

// Show tomorrow's schedule
for (const lesson of lessons[weekdayToShow.toLowerCase()]) {
      const lessonElement = document.createElement('h1');
      lessonElement.innerHTML = lesson;
      lessonsElement.appendChild(lessonElement);
}
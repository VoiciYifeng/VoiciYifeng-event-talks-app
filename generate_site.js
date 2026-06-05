const fs = require('fs');
const path = require('path');

// Placeholder talk data
const rawTalksData = [
  {
    id: 'talk-1',
    title: 'The Future of WebAssembly',
    speakers: ['Alice Smith'],
    category: ['WebAssembly', 'Frontend'],
    description: 'An in-depth look at the capabilities and future of WebAssembly beyond the browser.',
  },
  {
    id: 'talk-2',
    title: 'Advanced TypeScript Patterns',
    speakers: ['Bob Johnson', 'Carol White'],
    category: ['TypeScript', 'Programming', 'Backend'],
    description: 'Explore sophisticated TypeScript patterns to write more robust and maintainable codebases.',
  },
  {
    id: 'talk-3',
    title: 'Kubernetes in Production',
    speakers: ['David Green'],
    category: ['DevOps', 'Cloud'],
    description: 'Best practices for deploying and managing Kubernetes clusters in a production environment.',
  },
  {
    id: 'talk-4',
    title: 'Introduction to Machine Learning with TensorFlow.js',
    speakers: ['Eve Black'],
    category: ['Machine Learning', 'JavaScript'],
    description: 'Get started with machine learning directly in your browser using TensorFlow.js.',
  },
  {
    id: 'talk-5',
    title: 'Building Scalable APIs with Node.js and GraphQL',
    speakers: ['Frank White', 'Grace Lee'],
    category: ['Backend', 'Node.js', 'GraphQL'],
    description: 'Learn how to design and implement highly scalable APIs using Node.js and GraphQL.',
  },
  {
    id: 'talk-6',
    title: 'Modern CSS Techniques',
    speakers: ['Heidi Klum'],
    category: ['Frontend', 'CSS'],
    description: 'Discover the latest CSS features and techniques to create stunning web interfaces.',
  },
];

const eventConfig = {
  eventStartTime: '10:00', // HH:MM
  talkDuration: 60, // minutes
  transitionDuration: 10, // minutes
  lunchDuration: 60, // minutes
  lunchBreakAfterTalk: 3, // After which talk the lunch break occurs (0-indexed)
};

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function generateSchedule(talks, config) {
  const schedule = [];
  let currentTime = new Date(`2000-01-01T${config.eventStartTime}:00`); // Use a dummy date for time calculations

  talks.forEach((talk, index) => {
    // Add talk
    const talkStartTime = new Date(currentTime);
    currentTime.setMinutes(currentTime.getMinutes() + config.talkDuration);
    const talkEndTime = new Date(currentTime);

    schedule.push({
      ...talk,
      duration: config.talkDuration,
      startTime: formatTime(talkStartTime),
      endTime: formatTime(talkEndTime),
      type: 'talk',
    });

    // Add transition or lunch break
    if (index < talks.length - 1) {
      if (index === config.lunchBreakAfterTalk - 1) {
        // Add lunch break
        const lunchStartTime = new Date(currentTime);
        currentTime.setMinutes(currentTime.getMinutes() + config.lunchDuration);
        const lunchEndTime = new Date(currentTime);
        schedule.push({
          id: 'lunch-break',
          type: 'break',
          title: 'Lunch Break',
          duration: config.lunchDuration,
          startTime: formatTime(lunchStartTime),
          endTime: formatTime(lunchEndTime),
        });
      } else {
        // Add transition
        const transitionStartTime = new Date(currentTime);
        currentTime.setMinutes(currentTime.getMinutes() + config.transitionDuration);
        const transitionEndTime = new Date(currentTime);
        schedule.push({
          id: `transition-${index + 1}`,
          type: 'transition',
          title: 'Transition',
          duration: config.transitionDuration,
          startTime: formatTime(transitionStartTime),
          endTime: formatTime(transitionEndTime),
        });
      }
    }
  });

  return schedule;
}

const scheduleData = generateSchedule(rawTalksData, eventConfig);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Talk Event Schedule</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 900px;
            margin: 20px auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #0056b3;
            text-align: center;
            margin-bottom: 30px;
        }
        .search-container {
            margin-bottom: 20px;
            text-align: center;
        }
        .search-container input {
            width: 70%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        .schedule-item {
            background-color: #e9f5ff;
            border-left: 5px solid #007bff;
            margin-bottom: 15px;
            padding: 15px 20px;
            border-radius: 5px;
            transition: transform 0.2s ease-in-out;
        }
        .schedule-item:hover {
            transform: translateY(-3px);
        }
        .schedule-item.break {
            background-color: #fff3cd;
            border-left-color: #ffc107;
        }
        .schedule-item.transition {
            background-color: #e2e3e5;
            border-left-color: #6c757d;
            font-style: italic;
            color: #555;
        }
        .schedule-item h2 {
            margin-top: 0;
            color: #0056b3;
            font-size: 20px;
        }
        .schedule-item .time {
            font-weight: bold;
            color: #007bff;
            margin-bottom: 5px;
        }
        .schedule-item .speakers, .schedule-item .category {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
        }
        .schedule-item .category span {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 3px 8px;
            border-radius: 3px;
            margin-right: 5px;
            margin-bottom: 3px;
            font-size: 12px;
        }
        .schedule-item .description {
            font-size: 15px;
            line-height: 1.6;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Tech Talk Event Schedule</h1>

        <div class="search-container">
            <input type="text" id="categorySearch" placeholder="Search by category (e.g., Frontend, AI)">
        </div>

        <div id="schedule-list">
            <!-- Schedule items will be rendered here by JavaScript -->
        </div>
    </div>

    <script>
        const scheduleData = ${JSON.stringify(scheduleData, null, 2)};

        function renderSchedule(data) {
            const scheduleList = document.getElementById('schedule-list');
            scheduleList.innerHTML = ''; // Clear previous results

            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('schedule-item');
                if (item.type) {
                    itemDiv.classList.add(item.type);
                }

                let content = '<div class="time">' + item.startTime + ' - ' + item.endTime + ' (' + item.duration + ' min)</div>' +
                              '<h2>' + item.title + '</h2>';

                if (item.type === 'talk') {
                    content += '<div class="speakers"><strong>Speakers:</strong> ' + item.speakers.join(', ') + '</div>' +
                               '<div class="category">' +
                                   '<strong>Categories:</strong>' +
                                   item.category.map(cat => '<span>' + cat + '</span>').join('') +
                               '</div>' +
                               '<div class="description">' + item.description + '</div>';
                }

                itemDiv.innerHTML = content;
                scheduleList.appendChild(itemDiv);
            });
        }

        function filterSchedule() {
            const searchTerm = document.getElementById('categorySearch').value.toLowerCase();
            if (!searchTerm) {
                renderSchedule(scheduleData); // Show all if search term is empty
                return;
            }

            const filteredData = scheduleData.filter(item => {
                if (item.type === 'talk' && item.category) {
                    return item.category.some(cat => cat.toLowerCase().includes(searchTerm));
                }
                return false;
            });
            renderSchedule(filteredData);
        }

        // Initial render
        renderSchedule(scheduleData);

        // Add event listener for search
        document.getElementById('categorySearch').addEventListener('keyup', filterSchedule);
    </script>
</body>
</html>

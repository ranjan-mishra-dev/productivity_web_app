const getQuoteBtn = document.getElementById('getQuoteBtn');
const quotePopup = document.getElementById('quotePopup');
const closePopup = document.getElementById('closePopup');
const quoteText = document.getElementById('quoteText');
const authorText = document.getElementById('authorText');

// API Call
async function fetchQuote() {
  const apiUrl = 'https://api.api-ninjas.com/v1/quotes?category=happiness';
  const apiKey = 'kLkA9gvobfNqYZWvyCrqsQ==8Q91Sq8Mgga9TuIW';

  try {
    const response = await fetch(apiUrl, {
      headers: { 'X-Api-Key': apiKey }
    });

    const data = await response.json();
    const quote = data[0];

    // Display quote and author
    quoteText.textContent = `"${quote.quote}"`;
    authorText.textContent = `- ${quote.author}`;
  } catch (error) {
    quoteText.textContent = 'Failed to fetch the quote.';
    authorText.textContent = '';
  }
}

// Open Pop-up on Button Click
getQuoteBtn.addEventListener('click', () => {
  fetchQuote();
  quotePopup.classList.remove('hidden');
});

// Close Pop-up on Close Button Click
closePopup.addEventListener('click', () => {
  quotePopup.classList.add('hidden');
});


// Function to Update Time Every Second
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;


    // Get current day and date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    const dateString = `${dayName}, ${monthName} ${date}, ${year}`;
  
    // Update the DOM
    document.getElementById('current-time').textContent = timeString;
    document.getElementById('current-date').textContent = dateString;
  
  document.getElementById('current-time').textContent = timeString;
}

// Update Time Every Second
setInterval(updateTime, 1000);

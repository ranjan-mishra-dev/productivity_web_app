// Initialize Quill editor
const quill = new Quill('#editor-container', {
    theme: 'snow'
  });
  
  // Save Entry to localStorage
  document.getElementById('save-btn').addEventListener('click', () => {
    const title = document.getElementById('entry-title').value;
    const content = quill.root.innerHTML;
  
    if (title.trim() === "" || content.trim() === "<p><br></p>") {
      alert("Please provide both title and content.");
      return;
    }
  
    const entry = { 
      id: Date.now(),  // Unique ID for the entry
      title, 
      content, 
      date: new Date().toLocaleString() 
    };
  
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.push(entry);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  
    displayEntries();
    alert("Entry saved successfully!");
    quill.root.innerHTML = '';  // Clear the editor
    document.getElementById('entry-title').value = '';  // Clear the title input
  });
  
  // Display all saved entries
  function displayEntries() {
    const entriesContainer = document.getElementById('entries-container');
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
  
    if (entries.length === 0) {
      entriesContainer.innerHTML = '<p>No journal entries found.</p>';
      return;
    }
  
    entriesContainer.innerHTML = entries.map(entry => `
      <div class="entry">
        <button class="delete-btn" onclick="deleteEntry(${entry.id})">X</button>
        <h3>${entry.title}</h3>
        <p><strong>Date:</strong> ${entry.date}</p>
        <div>${entry.content}</div>
        <hr>
      </div>
    `).join('');
  }
  
  // Delete a specific entry
  function deleteEntry(id) {
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries = entries.filter(entry => entry.id !== id);
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    displayEntries();
  }
  
  // Search Entries by title or keyword
  document.getElementById('search-btn').addEventListener('click', () => {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const filteredEntries = entries.filter(entry => 
      entry.title.toLowerCase().includes(searchInput) || 
      entry.content.toLowerCase().includes(searchInput)
    );
  
    const entriesContainer = document.getElementById('entries-container');
    entriesContainer.innerHTML = filteredEntries.length > 0
      ? filteredEntries.map(entry => `
        <div class="entry">
          <button class="delete-btn" onclick="deleteEntry(${entry.id})">X</button>
          <h3>${entry.title}</h3>
          <p><strong>Date:</strong> ${entry.date}</p>
          <div>${entry.content}</div>
          <hr>
        </div>
      `).join('')
      : `<p>No entries found.</p>`;
  });
  
  // Load entries on page load
  window.onload = displayEntries;
  
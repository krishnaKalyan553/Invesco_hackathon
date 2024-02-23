import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

function App() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedValue, setSelectedValue] = useState('A');
  const [backendResult, setBackendResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (startDate && endDate) {
      const formData = {
        startDate: startDate.toDateString(),
        endDate: endDate.toDateString(),
        selectedValue: selectedValue,
      };
  
      try {
        // Sending a POST request to your Django API endpoint
        const response = await fetch('http://localhost:8000/api/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          // If the request is successful, you can handle the response here
          const result = await response.json();
          console.log('Response from Django API:', result);
  
          // You can update the state or perform other actions based on the response
        } else {
          console.error('Failed to send data to Django API');
        }
      } catch (error) {
        console.error('Error sending data to Django API:', error);
      }
    } else {
      console.log('Please select both start and end dates.');
    }
  };
  return (
    <div className="App">
      <h1>Date Range Picker</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Start Date:
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
        </label>
        <br />
        <label>
          End Date:
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </label>
        <br />
        <label>
          SelectStock:
          <select
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </label>
        <br />
        <button type="submit">Submit</button>
        {backendResult && (
  <div>
    <h2>Result from Django:</h2>
    <pre>{JSON.stringify(backendResult, null, 2)}</pre>
  </div>
)}
      </form>
    </div>
  );
}

export default App;

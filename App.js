import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

function App() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedValue, setSelectedValue] = useState('AAPL');
  const [backendResult, setBackendResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (startDate && endDate) {
      const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-CA', options);
      };
  
      const formData = {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        stock : selectedValue,
      };
  
      console.log(formData)
  
      try {
        
        const response = await fetch('http://localhost:8000/api/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          
          const result = await response.json();
          console.log('Response from Django API:', result);
  
          backendResult=result;
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
    <div className="ui justified container">
      <h1 className="ui header">Select Date</h1>
      <form onSubmit={handleSubmit} className="ui form">
      <div className="field">
      <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
        
      </div>
        
        <div className="field"> 
        <label> End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </div>
        <div className="field"> 
        <label> SelectStock:</label> 
          <select className="ui dropdown"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <option value="AAPL">AAPL(Apple)</option>
            <option value="MSFT">MSFT(Microsoft)</option>
            <option value="AMZN">AMZN(Amazon)</option>
            <option value="AVGO">AVGO(Broadcom)</option>
            <option value="META">META(Facebook)</option>
          </select>
        </div>
        <div className="field">
        <button  className="ui button" type="submit">Submit</button>
        </div>
        <div className ="field">
        {backendResult && (
  <div>
    <h2>Results:</h2>
    <pre>{JSON.stringify(backendResult, null, 2)}</pre>

  </div>
)}
        </div>
        
      </form>
      
    </div>
  );
}

export default App;

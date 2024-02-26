import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import { Chart as ChartJS } from "chart.js/auto";
import {Line} from "react-chartjs-2";
// import graph from "./graph"
import { Colors } from 'chart.js';


function App() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedValue, setSelectedValue] = useState('MSFT');
  const [backendResult, setBackendResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const formattedDate = format(currentDate, 'yyyy-MM-dd');
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
  
      console.log(formData.start_date)
  
      try {
        // Sending a POST request to your Django API endpoint
        const response = await fetch('http://localhost:8000', {
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
          setBackendResult(result);
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
            <option value="MSFT">MSFT</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </label>
        <br />
        <button type="submit">Submit</button>
        {backendResult && (
  <div>
    <h2>Result from Django:</h2>
    <pre>Analytical Var for 0.05    {backendResult.analytics_var_0_05}</pre>
    <pre>Analytical Var for 0.01    {backendResult.analytics_var_0_01}</pre>
    {/* <pre>Analytical Var for 0.05    {backendResult.analytics_var_0_05}</pre> */}
    {/* <pre>Analytical Var for 0.01    {backendResult.analytics_var_0_01}</pre> */}
    <div className="graph">
      <Line 
        // height={100}
        // width={100}
        data ={{
        labels : backendResult.x,
        datasets : [
          {
            label : "MSFT",
            data : backendResult.y,
            // backgroundColor:[]
            fill: true, // Enable fill
            backgroundColor: 'rgba(255, 0, 0)', // Specify fill color
            borderColor: 'rgba(255, 0, 0)', // Line color
            borderWidth: 2, // Line width
          }
        ],
       }} 
      />
    </div>
  </div>
)}
      </form>



        <div>
    <GoogleLogin
      onSuccess={credentialResponse => {
        var details = jwt_decode(credentialResponse.credential);
        console.log(details)
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />

    

  </div>


    </div>


  );
}

export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you have axios installed (npm install axios)

function VitalSignsApp() {
  const [respiratoryRate, setRespiratoryRate] = useState(0);
  const [oxygenSaturation, setOxygenSaturation] = useState(0);
  const [systolicBp, setSystolicBp] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [esiResponse, setEsiResponse] = useState('');
  const [ewsResponse, setEwsResponse] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const parsedValue = parseInt(value, 10); // Parse input as integers

    switch (name) {
      case 'respiratoryRate':
        setRespiratoryRate(parsedValue);
        break;
      case 'oxygenSaturation':
        setOxygenSaturation(parsedValue);
        break;
      case 'systolicBp':
        setSystolicBp(parsedValue);
        break;
      case 'heartRate':
        setHeartRate(parsedValue);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const esiUrl = 'https://jaylohokare.pythonanywhere.com/esi';
      const ewsUrl = 'https://jaylohokare.pythonanywhere.com/ews';

      const esiResponse = await axios.get(esiUrl, {
        params: {
          respiratory_rate: respiratoryRate,
          oxygen_saturation: oxygenSaturation,
          systolic_bp: systolicBp,
        },
      });

      const ewsResponse = await axios.get(ewsUrl, {
        params: {
          respiratory_rate: respiratoryRate,
          heart_rate: heartRate,
          systolic_bp: systolicBp,
        },
      });

      setEsiResponse(esiResponse.data[1]); // Access response text from ESI API
      setEwsResponse(ewsResponse.data);     // Access score from EWS API
    } catch (error) {
      console.error(error);
      setEsiResponse('Error: API call failed.');
      setEwsResponse('Error: API call failed.');
    }
  };

  return (
    <div className="App">
      <h1>Vital Signs Assessment</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="respiratoryRate">Respiratory Rate:</label>
        <input
          type="number"
          id="respiratoryRate"
          name="respiratoryRate"
          value={respiratoryRate}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="oxygenSaturation">Oxygen Saturation (%):</label>
        <input
          type="number"
          id="oxygenSaturation"
          name="oxygenSaturation"
          value={oxygenSaturation}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="systolicBp">Systolic Blood Pressure (mmHg):</label>
        <input
          type="number"
          id="systolicBp"
          name="systolicBp"
          value={systolicBp}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="heartRate">Heart Rate (bpm): (Optional for EWS)</label>
        <input
          type="number"
          id="heartRate"
          name="heartRate"
          value={heartRate}
          onChange={handleInputChange}
        />
        <button type="submit">Evaluate</button>
      </form>
      <div>
        <h2>ESI Response:</h2>
        <p>{esiResponse}</p>
      </div>
      <div>
        <h2>EWS Score:</h2>
        <p>{ewsResponse}</p>
      </div>
    </div>
  );
}

export default VitalSignsApp;

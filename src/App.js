import React, { useEffect, useState } from "react";
import { Button, Form, Card, Spinner } from "react-bootstrap";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { URL } from "./constants";

function App() {
  const [sectors, setSectors] = useState([]);
  const [name, setName] = useState("");
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    getSectorData();
  }, []);

  const getSectorData = async () => {
    try {
      const sectors = await axios.get(URL.sectors);
      setSectors(sectors.data.length > 0 ? sectors.data : []);
      console.log("Finish Loading");
    } catch (error) {
      console.log("Error");
    }
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onSectorSelection = (event) => {
    let tempSelectedSectors = [...selectedSectors];

    if (tempSelectedSectors.includes(event.target.value)) {
      tempSelectedSectors = tempSelectedSectors.filter(
        (sectorValue) => sectorValue !== event.target.value
      );
    } else {
      tempSelectedSectors.push(event.target.value);
    }

    setSelectedSectors(tempSelectedSectors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateData()) {
      const payload = {
        name,
        selectedSectors,
        isAgreed,
      };
      try {
        const response = await axios.post(URL.save, payload);
        toast.success(response.data.message);
      } catch (error) {
        toast.error(response.data.message);
      }
    }
  };

  const validateData = () => {
    if (!name) {
      toast.error("Please enter a name");
      return false;
    } else if (selectedSectors.length === 0) {
      toast.error("Please select a sector");
      return false;
    } else if (!isAgreed) {
      toast.error("Please agree the terms");
      return false;
    } else {
      return true;
    }
  };

  return (
    <Form className="container mt-2">
      <ToastContainer />
      <Card body>
        Please enter your name and pick the Sectors you are currently involved
        in.
      </Card>
      <Form.Group className="mb-3 mt-2" controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter name"
          onChange={onNameChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formSector">
        <Form.Label>Sectors</Form.Label>
        <Form.Select
          aria-label="Select a sector"
          multiple
          value={selectedSectors}
          onChange={onSectorSelection}
        >
          {sectors.map((sector, index) => (
            <option key={index} value={sector.value}>
              {sector.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check
          type="checkbox"
          label="Agree to terms"
          value={isAgreed}
          onChange={() => setIsAgreed(!isAgreed)}
        />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Save
      </Button>
    </Form>
  );
}

export default App;

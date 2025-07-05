import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Sidebar from "../components/Sidebar";
import Appbar from "../components/Appbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container, Grid } from "@mui/material";
import Searchbar from "../components/Searchbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UPDATE_REQUIREMENT, VIEW_DATA } from "../api";

const Faculty = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const userToken = sessionStorage.getItem("userToken");
  const userId = sessionStorage.getItem("userId");
  const admin = sessionStorage.getItem("admin");

  useEffect(() => {
    fetchDataFromDatabase();
  }, []);

  const fetchDataFromDatabase = async() => {
    await axios.get(`${VIEW_DATA}/${userToken}`)

      .then((response) => {
        setInput(response.data.data);
        setFilteredData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const applySearchFilters = (searchParams) => {
    const filtered = input.filter((val) => {
      return (
        (searchParams.trainingName === "" ||
          val.trainingName.includes(searchParams.trainingName)) &&
        (searchParams.trainingArea === "" ||
          val.trainingArea.includes(searchParams.trainingArea)) &&
        (searchParams.trainingCategory === "" ||
          val.trainingCategory.includes(searchParams.trainingCategory)) &&
        (searchParams.trainingInstitution === "" ||
          val.trainingInstitution.includes(searchParams.trainingInstitution))
      );
    });
    setFilteredData(filtered);
  };

  const handleSearch = (searchParams) => {
    applySearchFilters(searchParams);
  };

  const addClicked = (val) => {
    navigate("/curriculum", { state: { updateData: val } });
  };

  const deleteClicked = async(val) => {
    if (
      val.curriculumApproved === "Approved" &&
      admin != "true"
    ) {
      alert("Admin approval is needed to delete this curriculum");
    } else {
      val.curriculumDescription = "Type here";
      try {
        await axios.put(`${UPDATE_REQUIREMENT}/${val._id}`, val)

          .then((response) => {
            if (response.data.message === "Requirement Updated successfully") {
              alert("Curriculum deleted successfully");
              fetchDataFromDatabase();
            } else {
              alert(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSearchResults = (searchResults) => {
    if (
      searchResults &&
      searchResults.data &&
      Array.isArray(searchResults.data)
    ) {
      setFilteredData(searchResults.data);
    } else {
      setFilteredData([]);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', backgroundColor: '#fff', borderRight: '1px solid #ccc' }}>
        <Sidebar />
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Appbar at the top */}
        <Appbar />

        {/* Page content below Appbar */}
        <div style={{ padding: '100px 20px 20px', overflowY: 'auto' }}>
          <Container maxWidth="lg">
            {/* Search bar */}
            <Searchbar
              onSearch={handleSearch}
              onSearchResults={handleSearchResults}
            />

            {/* Table */}
            <TableContainer component={Paper} style={{ marginTop: "25px" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sl no.</TableCell>
                    <TableCell align="left">Requirement Name</TableCell>
                    <TableCell align="left">Training Area</TableCell>
                    <TableCell align="left">Category</TableCell>
                    <TableCell align="left">Institution</TableCell>
                    <TableCell align="left">Training Hours</TableCell>
                    <TableCell align="center">Actions</TableCell>
                    <TableCell align="center">Approval</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredData.map((val, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{val.trainingName}</TableCell>
                      <TableCell>{val.trainingArea}</TableCell>
                      <TableCell>{val.trainingCategory}</TableCell>
                      <TableCell>{val.trainingInstitution}</TableCell>
                      <TableCell>{val.trainingHours}</TableCell>
                      <TableCell align="center">
                        <VisibilityIcon
                          style={{ cursor: 'pointer', marginRight: '10px' }}
                          onClick={() => addClicked(val)}
                        />
                        <DeleteIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() => deleteClicked(val)}
                        />
                      </TableCell>
                      <TableCell align="center">{val.curriculumApproved}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </div>
      </div>
    </div>
  );

};

export default Faculty;

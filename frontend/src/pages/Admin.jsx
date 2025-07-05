import React, { useEffect, useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DELETE_POST, UPDATE_REQUIREMENT, VIEW_DATA } from "../api";

const Admin = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const userToken = sessionStorage.getItem("userToken");

  useEffect(() => {
    fetchDataFromDatabase();
  }, []);

  const fetchDataFromDatabase = async() => {
    await axios.get(`${VIEW_DATA}/${userToken}`)

      .then((response) => {
        const data = response.data.data;
        setInput(data);
        setFilteredData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const viewClicked = (val) => {
    navigate("/reqForm", {
      state: { updateData: val },
    });
  };

  const deleteClicked = async(id) => {
    await axios.delete(`${DELETE_POST}/${id}`)

      .then((response) => {
        if (response.data.message === "Curriculum deleted successfully") {
          alert(response.data.message);
          fetchDataFromDatabase();
        }
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  };

  const updateClicked = (val) => {
    navigate("/curriculum", { state: { updateData: val } });
  };

  const handleSearch = (searchParams) => {
    applySearchFilters(searchParams);
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

  // checkbox approval

  const handleCheckboxChange = async(e, val) => {
    if (e.target.checked) {
      val.curriculumApproved = "Approved";

      try {
        await axios.put(`${UPDATE_REQUIREMENT}/${val._id}`, val)
          .then((response) => {
            if (response.data.message === "Requirement Updated successfully") {
              alert(response.data.message);
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
    } else {
      val.curriculumApproved = "Not Approved";
      try {
        await axios.put(`${UPDATE_REQUIREMENT}/${val._id}`, val)
          .then((response) => {
            if (response.data.message === "Requirement Updated successfully") {
              alert(response.data.message);
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
      {/* Sidebar - fixed width */}
      <div style={{ width: '240px', backgroundColor: '#fff', borderRight: '1px solid #ddd' }}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Appbar />

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Container style={{ padding: '100px 24px 24px 24px' }}>
            <Searchbar
              onSearch={handleSearch}
              onSearchResults={handleSearchResults}
            />

            <TableContainer component={Paper} style={{ marginTop: '25px' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Sl no.</TableCell>
                    <TableCell align="left">Requirement Name</TableCell>
                    <TableCell align="left">Training Area</TableCell>
                    <TableCell align="left">Category</TableCell>
                    <TableCell align="left">Institution Name</TableCell>
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
                          onClick={() => viewClicked(val)}
                          style={{ cursor: 'pointer', marginRight: 8 }}
                        />
                        <UploadFileIcon
                          onClick={() => updateClicked(val)}
                          style={{ cursor: 'pointer', marginRight: 8 }}
                        />
                        <DeleteIcon
                          onClick={() => deleteClicked(val._id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`flexCheckDefault-${i}`}
                          checked={val.curriculumApproved === "Approved"}
                          onChange={(e) => handleCheckboxChange(e, val)}
                        />
                      </TableCell>
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

export default Admin;

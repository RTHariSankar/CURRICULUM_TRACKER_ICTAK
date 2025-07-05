import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/Download";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Sidebar from "../components/Sidebar";
import Appbar from "../components/Appbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Container,
  Input,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { DELETE_FILE, GET_FILES, UPDATE_REQUIREMENT, UPLOAD_FILE } from "../api";

const Curriculum = () => {
  const userId = sessionStorage.getItem("userId");
  const admin = sessionStorage.getItem("admin");
  const navigate = useNavigate();
  const location = useLocation();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetchingFiles, setFetchingFiles] = useState(false);

  const LinearIndeterminate = () => {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress color="secondary" />
      </Box>
    );
  };

  const [input, setInput] = useState({
    trainingName: "",
    trainingArea: "",
    trainingCategory: "",
    trainingInstitution: "",
    trainingHours: "",
    curriculumDescription: "Type here",
    curriculumFile: [""],
    curriculumApproved: "",
  });

  useEffect(() => {
    if (location.state && location.state.updateData) {
      setInput(location.state.updateData);
    }
  }, [location]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const submitClicked = async () => {
    try {
      if (location.state && location.state.updateData) {
        await axios
          .put(`${UPDATE_REQUIREMENT}/${location.state.updateData._id}`,
            input
          )
          .then((response) => {
            if (response.data.message === "Requirement Updated successfully") {
              alert(response.data.message);
              if (admin == "true") {
                navigate("/admin");
              } else {
                navigate("/faculty");
              }
            } else {
              alert(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [filesList, setFilesList] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    if (
      input.curriculumApproved === "Approved" &&
      admin !== "true"
    ) {
      alert("Only admin can change this document now");
    } else {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post(
          UPLOAD_FILE,
          formData
        );

        // Update curriculumFile array in the input state
        const newCurriculumFile = [
          ...input.curriculumFile,
          response.data.fileId,
        ];
        setInput({
          ...input,
          curriculumFile: newCurriculumFile,
        });

        // Make the server request to update the data
        try {
          const updateResponse = await axios.put(
            `${UPDATE_REQUIREMENT}/${location.state.updateData._id}`,
            {
              ...input,
              curriculumFile: newCurriculumFile,
            }
          );

          if (
            updateResponse.data.message === "Requirement Updated successfully"
          ) {
            alert(updateResponse.data.message);
          } else {
            alert(updateResponse.data.message);
          }
        } catch (error) {
          console.error(error);
        }

        // Display success message and update files list
        // alert(`File uploaded successfully! File ID: ${response.data.fileId}`);
        setSelectedFile(null); // Clear the selected file after successful upload
        fetchFilesList(); // Fetch the updated list of files from the server
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const fetchFilesList = async () => {
    try {
      setFetchingFiles(true);
      const response = await axios.get(GET_FILES);

      const files = response.data.files;
      const filteredFiles = files.filter(
        (file) => file.id !== "1UveMe0PhoZWzj2BnPO9z8Jge2m80UH1z"
      );

      setFilesList(filteredFiles);
      // setFilesList(filteredFiles);
    } catch (error) {
      console.error("Error fetching files list:", error);
    } finally {
      setFetchingFiles(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (
      input.curriculumApproved === "Approved" &&
      admin !== "true"
    ) {
      alert("Only admin can change this document now");
    } else {
      try {
        setDeleting(true);
        await axios.post(`${DELETE_FILE}/${fileId}`);

        // Delete the fileId from the curriculumFile array in the input state
        const newCurriculumFile = input.curriculumFile.filter(
          (id) => id !== fileId
        );
        setInput({
          ...input,
          curriculumFile: newCurriculumFile,
        });

        // Make the server request to update the data
        try {
          const updateResponse = await axios.put(
            `${UPDATE_REQUIREMENT}/${location.state.updateData._id}`,
            {
              ...input,
              curriculumFile: newCurriculumFile,
            }
          );

          if (
            updateResponse.data.message === "Requirement Updated successfully"
          ) {
            alert("Curriculum deleted successfully");
          } else {
            alert(updateResponse.data.message);
          }
        } catch (error) {
          console.error(error);
        }

        fetchFilesList(); // Fetch the updated list of files after successful deletion
      } catch (error) {
        console.error("Error deleting file:", error);
      } finally {
        setDeleting(false);
      }
    }
  };

  useEffect(() => {
    fetchFilesList();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar (Fixed width) */}
      <div style={{ width: '240px', backgroundColor: '#fff', borderRight: '1px solid #ddd' }}>
        <Sidebar />
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Appbar at the top */}
        <Appbar />

        {/* Scrollable content area */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Container style={{ marginTop: '100px' }}>
            {/* Centering the form horizontally */}
            <Grid container justifyContent="center" spacing={3}>
              {/* Left Card - Input Fields */}
              <Grid item xs={12} md={6}>
                <Card style={{ maxWidth: 500, margin: 'auto' }}>
                  <CardContent>
                    <Grid container spacing={3}>
                      {/* Training Name */}
                      <Grid item xs={12}>
                        <TextField
                          required
                          name="trainingName"
                          onChange={inputHandler}
                          value={input.trainingName}
                          label="Name of Training"
                          fullWidth
                          inputProps={{
                            readOnly: admin != "true"
                          }}
                        />
                      </Grid>

                      {/* Area of Training */}
                      <Grid item xs={12}>
                        <FormControl required fullWidth>
                          <InputLabel>Area of Training</InputLabel>
                          <Select
                            name="trainingArea"
                            onChange={inputHandler}
                            value={input.trainingArea}
                            label="Area of Training"
                            inputProps={{
                            readOnly: admin != "true"
                            }}
                          >
                            <MenuItem value="FSD">FSD</MenuItem>
                            <MenuItem value="ML-AI">ML-AI</MenuItem>
                            <MenuItem value="DSA">DSA</MenuItem>
                            <MenuItem value="RPA">RPA</MenuItem>
                            <MenuItem value="ST">ST</MenuItem>
                            <MenuItem value="CSA">CSA</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Category */}
                      <Grid item xs={12}>
                        <FormControl required fullWidth>
                          <InputLabel>Category of requirement</InputLabel>
                          <Select
                            name="trainingCategory"
                            value={input.trainingCategory}
                            onChange={inputHandler}
                            label="Category of requirement"
                            inputProps={{
                            readOnly: admin != "true"
                            }}
                          >
                            <MenuItem value="Retail">Retail</MenuItem>
                            <MenuItem value="Academic">Academic</MenuItem>
                            <MenuItem value="Corporate">Corporate</MenuItem>
                            <MenuItem value="Government">Government</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Institution Name */}
                      <Grid item xs={12}>
                        <TextField
                          required
                          name="trainingInstitution"
                          value={input.trainingInstitution}
                          onChange={inputHandler}
                          label="Name of Institution"
                          fullWidth
                          inputProps={{
                            readOnly: admin != "true"
                          }}
                        />
                      </Grid>

                      {/* No. of Hours */}
                      <Grid item xs={12}>
                        <TextField
                          required
                          name="trainingHours"
                          value={input.trainingHours}
                          onChange={inputHandler}
                          label="No. of hours"
                          fullWidth
                          inputProps={{
                            readOnly: admin != "true"
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Side - Description, File Upload, Buttons */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Description"
                  multiline
                  rows={8}
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Type here"
                  name="curriculumDescription"
                  onChange={inputHandler}
                  value={input.curriculumDescription}
                  inputProps={{
                    readOnly:
                      input.curriculumApproved === "Approved" &&
                      admin != "true",
                  }}
                />
                <Input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  fullWidth
                  style={{ marginTop: '27px' }}
                />
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  style={{ marginTop: '17px' }}
                >
                  Upload
                </Button>
                <Button
                  variant="contained"
                  onClick={submitClicked}
                  style={{ marginLeft: '17px', marginTop: '17px' }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>

            {/* Loading indicators */}
            {(uploading || fetchingFiles || deleting) && <LinearIndeterminate />}

            {/* Files Table */}
            <Container style={{ marginTop: '40px', marginBottom: '20px' }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Curriculum File</TableCell>
                      <TableCell align="center">Download</TableCell>
                      <TableCell align="center">Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filesList
                      .filter((file) => input.curriculumFile.includes(file.id))
                      .map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>{file.name}</TableCell>
                          <TableCell align="center">
                            <a href={file.webContentLink} target="_blank" rel="noopener noreferrer">
                              <DownloadIcon />
                            </a>
                          </TableCell>
                          <TableCell align="center">
                            <RemoveCircleIcon onClick={() => handleDelete(file.id)} />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </Container>
        </div>
      </div>
    </div>
  );

};

export default Curriculum;

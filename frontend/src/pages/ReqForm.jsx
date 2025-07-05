import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Container,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Appbar from "../components/Appbar";
import { ADD_REQUIREMENT, UPDATE_REQUIREMENT } from "../api";

const ReqForm = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const [input, setInput] = useState({
    trainingName: "",
    trainingArea: "",
    trainingCategory: "",
    trainingInstitution: "",
    trainingHours: "",
    curriculumDescription: "Type here",
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

  const submitClicked = async(e) => {
    e.preventDefault();

    if (location.state && location.state.updateData) {
      await axios
        .put(
          `${UPDATE_REQUIREMENT}/${location.state.updateData._id}`,

          input
        )
        .then((response) => {
          if (response.data.message === "Requirement Updated successfully") {
            alert(response.data.message);
            navigate("/admin");
          } else {
            alert(response.data.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      await axios.post(ADD_REQUIREMENT, input)

        .then((response) => {
          if (response.data.message === "Requirement added successfully") {
            alert(response.data.message);
            navigate("/admin");
          } else {
            alert(response.data.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  return (
    <div>
      <Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} sm={12} md={8}>
          <Appbar />
          <Container>
            <Card style={{ maxWidth: 500, margin: "auto", marginTop: "175px" }}>
              <form onSubmit={submitClicked}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        label="Name of Training"
                        name="trainingName"
                        onChange={inputHandler}
                        value={input.trainingName}
                        fullWidth
                        variant="standard"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="standard" required>
                        <InputLabel>Area of Training</InputLabel>
                        <Select
                          name="trainingArea"
                          value={input.trainingArea}
                          onChange={inputHandler}
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
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="standard" required>
                        <InputLabel>Category of requirement</InputLabel>
                        <Select
                          name="trainingCategory"
                          value={input.trainingCategory}
                          onChange={inputHandler}
                          required
                        >
                          <MenuItem value="Retail">Retail</MenuItem>
                          <MenuItem value="Academic">Academic</MenuItem>
                          <MenuItem value="Corporate">Corporate</MenuItem>
                          <MenuItem value="Government">Government</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Name of Institution"
                        fullWidth
                        variant="standard"
                        name="trainingInstitution"
                        onChange={inputHandler}
                        value={input.trainingInstitution}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="No. of hours"
                        fullWidth
                        variant="standard"
                        name="trainingHours"
                        value={input.trainingHours}
                        onChange={inputHandler}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </form>
            </Card>
          </Container>
        </Grid>
      </Grid>
    </div>
  );
};

export default ReqForm;
import React, { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import axios from "axios";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Button, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import { OPTIONS, VIEW_DATA } from "../api";

// Styled components moved outside the main component
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Searchbar = ({ onSearch, onSearchResults }) => {
  const [search, setSearch] = useState({
    trainingName: "",
    trainingArea: "",
    trainingCategory: "",
    trainingInstitution: "",
  });

  const [options, setOptions] = useState({
    trainingNames: [],
    trainingAreas: [],
    trainingCategories: [],
    trainingInstitutions: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [optionsLoaded, setOptionsLoaded] = useState(false);

  useEffect(() => {
    const fetchOptionsFromDatabase = async () => {
      try {
        setLoading(true);
        const response = await axios.get(OPTIONS);
        const {
          trainingNames,
          trainingAreas,
          trainingCategories,
          trainingInstitutions,
        } = response.data;
        
        setOptions({
          trainingNames: trainingNames || [],
          trainingAreas: trainingAreas || [],
          trainingCategories: trainingCategories || [],
          trainingInstitutions: trainingInstitutions || [],
        });
        setOptionsLoaded(true);
      } catch (err) {
        setError("Failed to load search options. Please try again later.");
        console.error("Error fetching options:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!optionsLoaded) {
      fetchOptionsFromDatabase();
    }
  }, [optionsLoaded]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  };

  const performSearch = async () => {
    if (!validateSearch()) return;

    try {
      setLoading(true);
      const response = await axios.get(VIEW_DATA, { 
        params: search 
      });
      
      if (response.data && response.data.length > 0) {
        onSearchResults(response.data);
      } else {
        onSearchResults([]);
        setError("No results found. Please try different search criteria.");
      }
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateSearch = () => {
    const { trainingName, trainingArea, trainingCategory, trainingInstitution } = search;
    
    if (!trainingName && !trainingArea && !trainingCategory && !trainingInstitution) {
      setError("Please enter at least one search criteria");
      return false;
    }
    
    return true;
  };

  const handleSearch = () => {
    setError(null);
    onSearch(search);
    performSearch();
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ backgroundColor: 'indigo' }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-evenly", flexWrap: 'wrap' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                type="text"
                placeholder="Training Name"
                name="trainingName"
                value={search.trainingName}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                list="nameOptions"
                disabled={loading}
              />
              <datalist id="nameOptions">
                {options.trainingNames.map((name, index) => (
                  <option key={`name-${index}`} value={name} />
                ))}
              </datalist>
            </Search>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                type="text"
                placeholder="Area"
                name="trainingArea"
                value={search.trainingArea}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                list="areaOptions"
                disabled={loading}
              />
              <datalist id="areaOptions">
                {options.trainingAreas.map((area, index) => (
                  <option key={`area-${index}`} value={area} />
                ))}
              </datalist>
            </Search>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                type="text"
                placeholder="Category"
                name="trainingCategory"
                value={search.trainingCategory}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                list="categoryOptions"
                disabled={loading}
              />
              <datalist id="categoryOptions">
                {options.trainingCategories.map((category, index) => (
                  <option key={`category-${index}`} value={category} />
                ))}
              </datalist>
            </Search>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                type="text"
                placeholder="Institution"
                name="trainingInstitution"
                value={search.trainingInstitution}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                list="institutionOptions"
                disabled={loading}
              />
              <datalist id="institutionOptions">
                {options.trainingInstitutions.map((institution, index) => (
                  <option key={`institution-${index}`} value={institution} />
                ))}
              </datalist>
            </Search>

            <Button 
              color="inherit" 
              variant="outlined" 
              onClick={handleSearch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

Searchbar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSearchResults: PropTypes.func.isRequired,
};

export default Searchbar;
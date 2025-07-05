// src/config/api.js

const BASE_URL = process.env.REACT_APP_API_BASE;

const SIGNUP_API = `${BASE_URL}/signup`;
const LOGIN_API = `${BASE_URL}/login`;
const UPDATE_REQUIREMENT = `${BASE_URL}/updateRequirement`;
const ADD_REQUIREMENT = `${BASE_URL}/requirementAdminPost`;
const VIEW_DATA = `${BASE_URL}/viewdata`;
const DELETE_FILE = `${BASE_URL}/delete-file-from-google-drive`;
const GET_FILES = `${BASE_URL}/get-files-list`;
const UPLOAD_FILE = `${BASE_URL}/upload-file-to-google-drive`;
const DELETE_POST = `${BASE_URL}/deletepost`;
const OPTIONS = `${BASE_URL}/options`;

export {
    OPTIONS,
    DELETE_POST,
    UPLOAD_FILE,
    GET_FILES,
    DELETE_FILE,
    VIEW_DATA,
    ADD_REQUIREMENT,
    UPDATE_REQUIREMENT,
    SIGNUP_API,
    LOGIN_API,
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BaseURL } from "../utils/constant";

const saveUser = (data, dispatch) => {
  dispatch({
    type: "SAVE_USER",
    payload: data,
  });
};

const getCourses = async (dispatch) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const { data } = await axios.get(`${BaseURL}/courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({
      type: "GET_COURSES",
      payload: data.data,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSessions = async (dispatch) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const { data } = await axios.get(`${BaseURL}/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(data)
    dispatch({
      type: "GET_SESSIONS",
      payload: data.data,
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  user: null,
  courses: [],
  sessions:[],
  saveUser,
  getCourses,
  getSessions,
};

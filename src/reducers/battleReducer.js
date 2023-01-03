import axios from "axios";
import { ROOT_URL } from "../utils/constants";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBattle = createAsyncThunk(
  "build/fetchBattle",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${ROOT_URL}/battles/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchMultiLog = createAsyncThunk(
  "build/fetchMultiLog",
  async (ids, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${ROOT_URL}/battles/multilog/${ids}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const slice = createSlice({
  name: "battle",
  initialState: {
    loading: true,
    battle: null,
    error: null,
  },
  reducers: {
    unsetBattle: (state) => {
      state.battle = null;
      state.loading = true;
      state.error = null;
    },
  },
  extraReducers: {
    [fetchBattle.fulfilled]: (state, action) => {
      state.battle = action.payload;
      state.loading = false;
    },
    [fetchBattle.rejected]: (state, action) => {
      state.battle = null;
      state.loading = false;
      state.error =
        "The battle could not be found. It is either too old or has not yet been parsed by the system.";
    },
    [fetchMultiLog.fulfilled]: (state, action) => {
      state.battle = action.payload;
      state.loading = false;
    },
    [fetchMultiLog.rejected]: (state, action) => {
      state.battle = null;
      state.loading = false;
      state.error = "The battles could not be parsed.";
    },
  },
});

export default slice.reducer;

export const getBattle = (state) => state.battle.battle;
export const getError = (state) => state.battle.error;
export const getLoadingBattle = (state) => state.battle.loading;

export const { unsetBattle } = slice.actions;

import API from "@/lib/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Player } from "./types";
import axios from "axios";

export const fetchPlayers = createAsyncThunk(
  "players/fetchPlayers",
  async (cursor: number | null = null, { rejectWithValue }) => {
    try {
      const response = await API.get("/players", {
        params: {
          cursor,
          per_page: 10,
        },
      });

      return {
        players: response.data.data,
        nextCursor: response.data.meta?.next_cursor ?? null,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch players"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

interface PlayerState {
  players: Player[];
  loading: boolean;
  nextCursor: number | null;
}

const initialState: PlayerState = {
  players: [],
  loading: false,
  nextCursor: null,
};

const playerSlice = createSlice({
  name: "players",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        const existingIds = new Set(state.players.map((p) => p.id));
        const newPlayers = action.payload.players.filter(
          (p: { id: string }) => !existingIds.has(p.id)
        );

        state.players = [...state.players, ...newPlayers];
        state.nextCursor = action.payload.nextCursor;
        state.loading = false;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        console.error(action.payload);
      });
  },
});

export default playerSlice.reducer;

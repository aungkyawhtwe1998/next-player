import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Team } from './types'; 
import { Player } from '../players/types';

interface TeamState {
  teams: Team[];
}

const getInitialTeams = (): Team[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('teams');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  return []; // SSR fallback
};

const initialState: TeamState = {
  teams: getInitialTeams(),
};

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    createTeam: (state, action: PayloadAction<Team>) => {
      const exists = state.teams.some((team) => team.name === action.payload.name);
      if (!exists) {
        state.teams.push(action.payload);
        localStorage.setItem('teams', JSON.stringify(state.teams));
      } else {
        throw new Error('Team name must be unique.');
      }
    },
    updateTeam: (state, action: PayloadAction<Team>) => {
      const index = state.teams.findIndex((team) => team.id === action.payload.id);
      if (index !== -1) {
        state.teams[index] = action.payload;
        localStorage.setItem('teams', JSON.stringify(state.teams));
      }
    },
    deleteTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter((team) => team.id !== action.payload);
      localStorage.setItem('teams', JSON.stringify(state.teams));
    },

    addPlayerToTeam: (
      state,
      action: PayloadAction<{ teamId: string; player: Player }>
    ) => {
      const { teamId, player } = action.payload;
      const team = state.teams.find((team) => team.id === teamId);
      if (team) {
        
        const playerExists = team.players?.some((p) => p.id === player.id);
        if (!playerExists) {
          team.players?.push(player);
          localStorage.setItem('teams', JSON.stringify(state.teams));
        }
      }
    },

    removePlayerFromTeam: (
      state,
      action: PayloadAction<{ teamId: string; playerId: string }>
    ) => {
      const { teamId, playerId } = action.payload;
      const team = state.teams.find((team) => team.id === teamId);
      if (team) {
        team.players = team.players?.filter((player) => player.id !== playerId);
        localStorage.setItem('teams', JSON.stringify(state.teams));
      }
    },
  },
});

export const { createTeam, updateTeam, deleteTeam, addPlayerToTeam, removePlayerFromTeam } = teamSlice.actions;

export default teamSlice.reducer;

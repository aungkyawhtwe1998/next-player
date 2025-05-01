import { Player } from "../players/types";

export interface Team {
    id: string;
    name: string;
    player_count?: number;
    players?:Player[];
    country: string;
    region: string;
    division?: string;
    city?: string;
    conference?: string;
    full_name?: string;
    abbreviation?: string;
  }

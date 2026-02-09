import type { CommonResponse } from "../common";

export interface TeamList {
    teams: Team[];
}

export interface Team {
    teamId: number;
    name: string;
}

export interface Member {
    id: number;
    name: string;
    roles: string[];
}

export type ResponseTeamListDTO = CommonResponse<TeamList[]>;
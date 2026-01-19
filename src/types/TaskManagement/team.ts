export interface Team {
    id: number;
    name: string;
    members: Member[];
}

export interface Member {
    id: number;
    name: string;
    roles: string[];
}
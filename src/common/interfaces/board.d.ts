export interface Welcome4 {
    title: string;
    users: User[];
    lists: { [key: string]: List };
}

export interface List {
    id:       number;
    cards:    { [key: string]: Card };
    title:    string;
    position: number;
}

export interface Card {
    id:          number;
    title:       string;
    description: string;
    users:       number[];
    created_at:  number;
    position:    number;
}

export interface User {
    id:       number;
    username: string;
}

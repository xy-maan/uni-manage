export type Comments=Comment[]
export interface Comment {
    id:              number;
    post:            number;
    author:          number;
    author_name:     string;
    author_username: string;
    author_role:     string;
    content:         string;
    created_at:      Date;
    updated_at:      Date;
}
export interface Feedback {
    id:            number;
    project:       number;
    task:          null;
    deliverable:   null;
    meeting:       null;
    author:        number;
    author_detail: AuthorDetail;
    content:       string;
    created_at:    Date;
    updated_at:    Date;
}

export interface AuthorDetail {
    id:         number;
    username:   string;
    full_name:  string;
    email:      string;
    role:       string;
    avatar_url: null;
}

export type PostItems = PostItem[];
export interface PostItem {
    id:              number;
    author:          number;
    author_name:     AuthorName;
    author_username: AuthorUsername;
    author_role:     AuthorRole;
    title:           string;
    content:         string;
    post_type:       PostType;
    category:        number | null;
    tags:            Tag[];
    attachments:     Attachment[];
    poll_options:    PollOption[];
    poll_ends_at:    null;
    views_count:     number;
    upvotes_count:   number;
    downvotes_count: number;
    comments_count:  number;
    has_upvoted:     boolean;
    has_downvoted:   boolean;
    created_at:      Date;
    updated_at:      Date;
}

export interface Attachment {
    id:          number;
    file:        string;
    uploaded_at: Date;
}

export enum AuthorName {
    MariemHussein = "Mariem Hussein",
}

export enum AuthorRole {
    Student = "STUDENT",
}

export enum AuthorUsername {
    Mariem = "mariem",
}

export interface PollOption {
    id:         number;
    text:       string;
    vote_count: number;
    has_voted:  boolean;
}

export enum PostType {
    Poll = "POLL",
    Text = "TEXT",
}

export interface Tag {
    id:   number;
    name: Name;
}

export enum Name {
    AI = "ai",
    Frontend = "frontend",
    MachineLearning = "machine learning",
    React = "react",
}

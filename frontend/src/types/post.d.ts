export interface Post  {
    id:              number;
    author:          number;
    author_name:     string;
    author_username: string;
    author_role:     string;
    title:           string;
    content:         string;
    post_type:       string;
    category:        null;
    tags:            Tag[];
    attachments:     any[];
    poll_options:    any[];
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

export interface Tag {
    id:   number;
    name: string;
}
export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
}
export type Tag = {
  id: number;
  name: string;
}

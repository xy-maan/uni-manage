export interface InteractionType {
    payload: InteractionPayload;
    ok:      boolean;
}

export interface InteractionPayload  {
    upvotes_count:   number;
    downvotes_count: number;
    has_upvoted:     boolean;
    has_downvoted:   boolean;
}

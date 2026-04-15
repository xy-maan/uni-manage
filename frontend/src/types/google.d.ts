export interface AuthResponse  {
    access:             string;
    refresh:            string;
    user:               User;
    access_expiration:  Date;
    refresh_expiration: Date;
}

export interface AuthUser  {
    pk:         number;
    username:   string;
    email:      string;
    first_name: string;
    last_name:  string;
}

export interface StudentData {
    user:           User;
    major:          string;
    academic_level: string;
    gpa:            number;
    skills:         string[];
}

export interface User {
    id:         number;
    email:      string;
    first_name: string;
    last_name:  string;
    role:       string;
}

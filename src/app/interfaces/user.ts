export interface User {    
    id: string;
    username: string;
    fullname: string;    
    email: string;
    city?: string;
    state?: string;
    books: number;
    incoming: number;
}

import {Book} from './book';

export interface Request {
    bookFrom : Book,
    bookTo : Book,
    status: string,
    usernameFrom: string,
    usernameTo:string,
    date: number;
    id?: string;
}

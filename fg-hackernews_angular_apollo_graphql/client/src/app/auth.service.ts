import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
    AUTH_USER_TOKEN,
    AUTH_USER_ID,
    AUTH_USER_NAME
} from './constants';

/**
 * AuthService -
 * The Service deals with all task related to logging-in
 * or logging-out a user and providing the user-status
 * within the application
*/
@Injectable()
export class AuthService {
    public userId: string = null;
    public userName: string = null;
    private _isAuthenticated = new BehaviorSubject(false);

    /**
     * Consturctor of the AuthService-Class
    */
    constructor() {}

    /**
     * Getter for an boolean observable object, used
     * to signal the application about a users login
     * or logout
     */
    get isAuthenticated(): Observable<boolean> {
        return this._isAuthenticated.asObservable();
    }

    /**
     * Methode stores an authenticated users data into
     * localstorage and calls methode to signal the
     * application that a user logged-in
     * @param id The logged-in users id
     * @param token The logged-in users token
     * @param name The logged-in users name
     */
    saveUserData(id: string, token: string, name: string) {
        localStorage.setItem(AUTH_USER_ID, id);
        localStorage.setItem(AUTH_USER_TOKEN, token);
        localStorage.setItem(AUTH_USER_NAME, name);
        this.setUserId(id, name);
    }

    /**
     * Methode sets the serices members and signals
     * the application that the user logged-in
     * @param id The logged-in users id
     * @param name The logged-in users name
     */
    setUserId(id: string, name: string) {
        this.userId = id;
        this.userName = name;
        this._isAuthenticated.next(true);
    }

    /**
     * Methode deletes a users id, name and token from
     * localstorage, resets the services members and
     * signals the application that the user logged-out
    */
    logout() {
        localStorage.removeItem(AUTH_USER_ID);
        localStorage.removeItem(AUTH_USER_TOKEN);
        localStorage.removeItem(AUTH_USER_NAME);
        this.userId = null;
        this.userName = null;
        this._isAuthenticated.next(false);
    }

    /**
     * Methode checks for a users id, name and token in localstorage.
     * If available call methode to signal that user is authenticated
    */
    autoLogin() {
        const id = localStorage.getItem(AUTH_USER_ID);
        const name = localStorage.getItem(AUTH_USER_NAME);
        const token = localStorage.getItem(AUTH_USER_TOKEN);
        if (id && name && token) {
            this.setUserId(id, name);
        }
    }
}

import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Request, RequestMethod, Response, URLSearchParams } from '@angular/http';
import { HttpParams, HttpClient } from "@angular/common/http"

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {User} from '../app/user';
import {map} from 'rxjs/operator/map';
import {Buzz} from '../app/buzz';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService {

    options: any;
    forum: Buzz;


    constructor(private  http: Http,
                private httpClient: HttpClient) {

        let authtoken = localStorage.getItem('auth_token');
        let headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        this.options = new RequestOptions({headers: headers});

        this.forum = new Buzz();

        //uID: string, ini: string, name: string, surname: string, email: string, cell: string, modules: string, pseodoname: string, title: string
    }

    OnInit(){
        /**
         * This is temporary, populates the Users-DB with test Users.
         */
        this.forum.addUserBuzz("u88888888",'LK', 'Thato', 'Maseko', 'nmothoa360@gmail.com', '0457814531', 'COS 124, COS 444, COS 333', 'Gina', 'MRS');
        this.forum.addUserBuzz("u12147892", 'ML','Jane', 'Formiu', "kamotsipa@gmail.com", '0457814531', 'COS 124, COS 444, COS 333', 'Lash', 'MR');
        this.forum.addUserBuzz("u56746321", 'GH','Pete', 'Vanti',"niknak@gmail.com", '0457814531', 'COS 124, COS 444, COS 333', 'Rush', 'MR');
        this.forum.addUserBuzz("u13546978", 'DL','Lefa', 'Cidi',"johnny@gmail.com", '0457814531', 'COS 124, COS 444, COS 333', 'Brad', 'MR');
        this.forum.addUserBuzz("u15457845", 'PO', 'Puti', 'Januo',"kites@gmail.com", '0457814531', 'COS 124, COS 444, COS 333', 'Litre', 'MRS');
        this.forum.addUserBuzz("u12457896", 'D', 'Johan', 'Reelo',"@gmail.com", '0457814531', 'COS 124, COS 444, COS 333', 'Serve', 'MR');
        this.forum.addUserBuzz("u16547889", 'WE','Nathan', 'Lates',"nj@gmail.com", '0457814531', 'COS 124, COS 444, COS 333', 'Chief', 'MR');
        this.forum.addUserBuzz("u17457856",  'A','Kamo', 'Pauls',"racc@gmail.com", '0457814531', 'COS 124, COS 444, COS 333', 'High', 'MRS');
        this.forum.addUserBuzz("u12457896", 'E', 'Nkosi', 'Smith',"count@gmail.com", '0457814531', 'COS 124, COS 444, COS 333', 'Jack', 'MR');

        console.log("Length: " + this.forum.BuzzUsers.length);
    }

    authenticateUser(uName: string){

        let params: URLSearchParams = new URLSearchParams();
        params.set('userID', uName);
        this.options.search = params;

        return this.http.get('/getUser/:userID', this.options)
            .map(body => body.toString())
            .toPromise();
    }

    /**
     *
     * @param {User} user The user being added to the Users-DB
     * @returns {Promise<any>}
     */
    addUser(user: User){
        let urlsearchParams = new URLSearchParams();
        urlsearchParams.append('userID', user.userID);
        urlsearchParams.append('initials', user.initials);
        urlsearchParams.append('name', user.name);
        urlsearchParams.append('surname', user.surname);
        urlsearchParams.append('email', user.email);
        urlsearchParams.append('cell', user.cell);
        urlsearchParams.append('modules', user.modules);
        urlsearchParams.append('pseodoname', user.pseodoname);
        urlsearchParams.append('title', user.title);

        let body = urlsearchParams.toString();

        return this.http.post('/createUser', user, this.options)
            .map(body => body.json())
            .toPromise()
            .catch(this.handleError);
    }

    simpleAuth(user: string){
        console.log("SimpleAuth: " + user);
        return this.forum.validateME(user);
    }

    getUser(user: User){
        //let params = new HttpParams();
        //params = params.append('userID', user.userID);

        let params: URLSearchParams = new URLSearchParams();
        params.set('userID', user.userID);
        this.options.search = params;

        return this.http.get('/getUser/:userID', this.options)
            .map(body => body.toString())
            .toPromise()
            .then()
            .catch();
    }

    getAll(){
        //let params = new HttpParams();
        //params = params.append('userID', user.userID);

        /*let params: URLSearchParams = new URLSearchParams();
        params.set('userID', user.userID);
        this.options.search = params;*/

        return this.http.get('/display')
            .map(body => body.toString())
            .toPromise()
            .then()
            .catch();
    }

    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}

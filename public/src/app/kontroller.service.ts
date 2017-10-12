import { Injectable } from '@angular/core';
import {Http, RequestOptions, Request, RequestMethod, Headers} from "@angular/http";
import "rxjs";
import {Observable} from "rxjs";
import {Post} from "./post";

@Injectable()
export class KontrollerService {

    constructor(private _http: Http) { }

    createGroup(p){
          console.log("CALLED CREATE GROUP");
          var authtoken = localStorage.getItem('auth_token');
          var headers = new Headers({'Accept':'application/json'});
          headers.append('Authorization', 'Bearer ${authToken}');
          var options = new RequestOptions({headers: headers});
          return this._http.post("/createGroup/",p)
              .map(data => data.json())
              .toPromise();
      }

    createMessage(p){
          console.log("CALLED CREATE MESSAGE");
          var authtoken = localStorage.getItem('auth_token');
          var headers = new Headers({'Accept':'application/json'});
          headers.append('Authorization', 'Bearer ${authToken}');
          var options = new RequestOptions({headers: headers});
          return this._http.post("/createMessage/",p)
              .map(data => data.json())
              .toPromise();
      }

    getBasicUserInfo(x: String){
        console.log("CALLED GETUSER");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        return this._http.get("/getBasicUserInfo/"+x, options)
            .map(userID => userID.json())
            .toPromise();
    }
    getGroupMessages(x: String){
        console.log("CALLED GETGROUP MESSAGES");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        return this._http.get("/getGroupMessages/"+x, options)
            .map(data => data.json().data)
            .toPromise();
    }

    groupsJoined(x: String){
        console.log("CALLED GROUPS JOINED");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        return this._http.get("/groupsJoined/"+x, options)
            .map(data => data.json().groups)
            .toPromise();
    }

    getGroupInformation(p){
        console.log("CALLED GET GROUP INFO");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        return this._http.get("/getGroupInformation/"+p, p)
            .map(data => data.json().data)
            .toPromise();
    }

    getUserVotes(p, u){
        console.log("CALLED GET GET USER VOTES");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        return this._http.get("/getUserStats/"+p+"/"+u, p)
            .map(data => data.json().data)
            .toPromise();
    }

    joinGroup(p){
        console.log("CALLED JOIN GROUP");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        return this._http.patch("/joinGroup/", p)
            .map(groupname => groupname)
            .toPromise();
    }

    getMilestones(x: String){
        console.log("CALLED GET milestones");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        return this._http.get("/getMilestones"+x, options)
            .map(data => data.json().data)
            .toPromise();
    }

    getUserPoints(x: String){
        console.log("CALLED GET userpoints");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        return this._http.get("/getUserPoints/"+x, options)
            .map(data => data.json())
            .toPromise();
    }
    getUserStatus(x: String){
        console.log("CALLED GET getUserStatus");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        return this._http.get("/getUserStatus/"+x, options)
            .map(data => data.json().data)
            .toPromise();
    }

    studentsInModule(x: String){
        console.log("CALLED GET studentsInModule");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        return this._http.get("/studentsInModule/"+x, options)
            .map(data => data.json().data)
            .toPromise();
    }

    attempt(x: String){
        console.log("CALLED GET attempt");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        return this._http.get("/attempt/"+x, options)
            .map(data => data.json().text)
            .toPromise();
    }

    createMilestone(p){
        console.log("CALLED CREATE MILESTONE");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        return this._http.post("/createMilestone",p)
            .map(data => data.json())
            .toPromise();
    }
}

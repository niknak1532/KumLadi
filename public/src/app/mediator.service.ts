import { Injectable } from '@angular/core';
// import {CPU} from "./cpu";

import {Http, RequestOptions, Request, RequestMethod, Headers} from "@angular/http";
import "rxjs";
import {Observable} from "rxjs";
import {Post} from "./post";

@Injectable()
export class MediatorService {


  constructor(private _http: Http) { }

    createResponce(x: string, p: Post){
         console.log("CALLED CREATE RESPONCE-POST");
	 var authtoken = localStorage.getItem('auth_token');
	 var headers = new Headers({'Accept':'application/json'});
	 headers.append('Authorization', 'Bearer ${authToken}');
	 var options = new RequestOptions({headers: headers});
         return this._http.post("/addPost/"+x,p)
            .map(data => data.json())
            .toPromise();
    }

    createThread(x: string, p: Post){
         console.log("CALLED CREATE RESPONCE-POST");
	 var authtoken = localStorage.getItem('auth_token');
	 var headers = new Headers({'Accept':'application/json'});
	 headers.append('Authorization', 'Bearer ${authToken}');
	 var options = new RequestOptions({headers: headers});
         return this._http.post("/createPost",p)
            .map(data => data.json())
            .toPromise();
    }



    upVote(x: string, p){
         console.log("CALLED UPVOTE ");
	 var authtoken = localStorage.getItem('auth_token');
	 var headers = new Headers({'Accept':'application/json'});
	 headers.append('Authorization', 'Bearer ${authToken}');
	 var options = new RequestOptions({headers: headers});
	 console.log(p);
         return this._http.post("/upVote",p)
            .map(data => data.json())
            .toPromise();
    }

    downVote(x: string, p){
        console.log("CALLED DOWNVITE ");
        var authtoken = localStorage.getItem('auth_token');
        var headers = new Headers({'Accept':'application/json'});
        headers.append('Authorization', 'Bearer ${authToken}');
        var options = new RequestOptions({headers: headers});
        console.log(p);
        return this._http.post("/downVote",p)
            .map(data => data.json())
            .toPromise();
    }

    getLevelZeros(x: String){
         console.log("CALLED GET LEVEL ONES");
	 var authtoken = localStorage.getItem('auth_token');
	 var headers = new Headers({'Accept':'application/json'});
	 headers.append('Authorization', 'Bearer ${authToken}');
	 var options = new RequestOptions({headers: headers});
         return this._http.get("/getAllPosts/"+x, options)
            .map(data => data.json().data)
            .toPromise();
    }



    getUpVotes(x: String){
         console.log("CALLED GET-UP-VOTES");
	 var authtoken = localStorage.getItem('auth_token');
	 var headers = new Headers({'Accept':'application/json'});
	 headers.append('Authorization', 'Bearer ${authToken}');
	 var options = new RequestOptions({headers: headers});
         return this._http.get("/getUpVotes/"+x, options)
            .map(data => data.json().num)
            .toPromise();
    }
    getDownVotes(x: String){
         console.log("CALLED GET-DOWN-VOTES");
	 var authtoken = localStorage.getItem('auth_token');
	 var headers = new Headers({'Accept':'application/json'});
	 headers.append('Authorization', 'Bearer ${authToken}');
	 var options = new RequestOptions({headers: headers});
         return this._http.get("/getDownVotes/"+x, options)
            .map(data => data.json().num)
            .toPromise();
    }

    getUser(x: String){
         console.log("CALLED GETUSER");
	 var authtoken = localStorage.getItem('auth_token');
	 var headers = new Headers({'Accept':'application/json'});
	 headers.append('Authorization', 'Bearer ${authToken}');
	 var options = new RequestOptions({headers: headers});
         return this._http.get("/getUser/"+x, options)
            .map(userID => userID.json())
            .toPromise();
    }

    getChildPosts(x: String, p: String){
         console.log("CALLED GET CHILDREN of "+x);
	 var authtoken = localStorage.getItem('auth_token');
	 var headers = new Headers({'Accept':'application/json'});
	 headers.append('Authorization', 'Bearer ${authToken}');
	 var options = new RequestOptions({headers: headers});
         return this._http.get("/getChildPosts/"+x+"/"+p, options)
            .map(data => data.json().data)
            .toPromise();
    }

    getSiblingPosts(x: String, p: String){
         console.log("CALLED GET SIBLINGS of "+x);
	 var authtoken = localStorage.getItem('auth_token');
	 var headers = new Headers({'Accept':'application/json'});
	 headers.append('Authorization', 'Bearer ${authToken}');
	 var options = new RequestOptions({headers: headers});
         return this._http.get("/getSiblings/"+x+"/"+p, options)
            .map(data => data.json().data)
            .toPromise();
    }

    getRecentPosts(x: String){
         console.log("CALLED GET RECENT POSTS "+x);
	 var authtoken = localStorage.getItem('auth_token');
	 var headers = new Headers({'Accept':'application/json'});
	 headers.append('Authorization', 'Bearer ${authToken}');
	 var options = new RequestOptions({headers: headers});
         return this._http.get("/getRecentPosts/"+x)
            .map(data => data.json().data)
            .toPromise();
    }

    getContent(x: String){
         console.log("CALLED GET CONTENT of "+x);
	 var authtoken = localStorage.getItem('auth_token');
	 var headers = new Headers({'Accept':'application/json'});
	 headers.append('Authorization', 'Bearer ${authToken}');
	 var options = new RequestOptions({headers: headers});
         return this._http.get("/getContent/"+x, options)
            .map(data => data.json())
            .toPromise();
    }

    getPosts(){
        // let authToken = localStorage.getItem('auth_token');
        // let headers = new Headers({"Accept":"application/json"});
        // headers.append('Authorization','Bearer ${authToken}');
        // let options = new RequestOptions({headers:headers});

        // return this._http.get("http://localhost:1337/posts")
        //     .map(data => data.json())
        //     .toPromise();
    }

  // getChildren(): Observable<CPU>{
  //   return
  // }
}

import { Component } from '@angular/core';
import {Post} from './post';
import {MediatorService} from "./mediator.service";
import {SuperPost} from "./super-post";
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';


//Recent click
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Buzz';
    display: boolean = false;

    showDialog() {
        this.display = true;
    }
    user_Id = '';
    user_password = '';
    sm_moduleName: string = 'COS101';
    //Remember COS101 is not integrated yet to other components

    app_module: string = '';
    app_content: string = '';
    user_bounty = 321;
    user_points = 1245;
    newPost: Post;
    userObject = [];
    sm_Posts  = [];
    sp_Posts = [];
    rp_Posts: Array<Post>  = [];
    mess_Post: Post = null;
    co_Posts = [];
    idForMe : string;
    responseDialog = [];
    tags: Array<String> = [];
    nav_crums = [];
    level: Number;
    newContent: string = '';
    newHeading: string = '';
    upVotes = -1;
    downVotes = -1;
    constructor(private _mediatorService: MediatorService){}
    nb_comp_ids: Array<String> = [];
    createNewModule(){
    }

    login_Attempt(usrId: string, usrPswrd: string)
    {
        console.log("userId:"+usrId+"UserPsswrd: "+usrPswrd);

        this._mediatorService.getUser(usrId)
            .then(userObject => {this.userObject = userObject; this.authenticatePassword()})
            .catch(err => console.log(err));
    }

    authenticatePassword()
    {
        if (this.userObject.length == 0)
        {
            this.responseDialog.pop();
            this.responseDialog.push({severity:'error', summary:'Error Message', detail:'Validation failed'});


        }
        else
        {
            this.user_Id = this.userObject[0].userID;
            sessionStorage.setItem("sessionID",this.user_Id);
            this.responseDialog.pop();
            this.dashBored();
        }
    }

    logOut()
    {
        this.userObject = [];
        sessionStorage.removeItem("sessionID");
        console.log('sessionId agter log out'+ sessionStorage.getItem("sessionID"))
        this.dashBored();
    }

     sleepX(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    }

    dashBored()
    {

        if (sessionStorage.getItem("sessionID"))
        {
            this._mediatorService.getUser(sessionStorage.getItem("sessionID"))
                .then(userObject => {this.userObject = userObject;})
                .catch(err => console.log(err));
            this.getAllPosts('COS101');
            document.getElementById('id_dashboard').style.display = 'inline';
            document.getElementById('id_login').style.display = 'none';
            this.user_Id = sessionStorage.getItem("sessionID");
        }
        else
        {
            document.getElementById('id_dashboard').style.display = 'none';
            document.getElementById('id_login').style.display = 'inline';
        }
    }


    toProfile()
    {
    }

    getAllPosts(x: string )
    {
        this._mediatorService.getLevelZeros(x)
            .then(sm_Posts => this.sm_Posts = sm_Posts)
            .catch(err => console.log(err));

        this.setRecentPosts(x);
    }

    populatePostOffice(x: SuperPost,  x_list: Array<Post>, v : number)
    {

    }

    setSibs(choosenId: string, pHeading: string)
    {
        this.nav_crums = [];
        this.nav_crums.push({heading: pHeading,postId: choosenId});
        this.x_setSibs(choosenId);
        this.x_setMessage(choosenId);
    }

    x_setSibs(choosenId: string)
    {
        this.sp_Posts = [];
        this._mediatorService.getChildPosts(choosenId)
        // .then(sp_Posts => {this.sp_Posts = sp_Posts; if (this.sp_Posts.length == 0) this.noChildrenLevelZero(choosenId);})
            .then(sp_Posts => this.sp_Posts = sp_Posts)
            .catch(err => console.log(err));
    }



    setMessage(choosenId: string, heading: string)
    {
        this.nav_crums.push({heading: heading,postId: choosenId});
        this.x_setMessage(choosenId);
    }

    noChildrenLevelZero(x: string)
    {
        this._mediatorService.getLevelZeros(x)
            .then(sp_Posts => this.sp_Posts = sp_Posts)
            .catch(err => console.log(err));

    }

    x_setMessage(choosenId: string)
    {
        this.idForMe = choosenId;
        this._mediatorService.getContent(choosenId)
            .then(mess_Post => this.mess_Post = mess_Post)
            .catch(err => console.log(err));
        this.setResponses(choosenId);
        this.loadUpVotes(choosenId);
        this.loadDownVotes(choosenId);
    }

    setMessage2(choosenId: string, heading: string)
    {
        this.sp_Posts = [];
        for (let i =0; i < this.sp_Posts.length; i++)
            this.sp_Posts.pop();
        this.setMessage(choosenId, heading);
        this.x_setSibs(choosenId);
    }

    setResponses(choosenId: string)
    {
        this._mediatorService.getChildPosts(choosenId)
            .then(co_Posts => this.co_Posts = co_Posts)
            .catch(err => console.log(err));
    }

    setRecentPosts(moduCode: string)
    {
        this._mediatorService.getRecentPosts(moduCode)
            .then(rp_Posts => this.rp_Posts = rp_Posts)
            .catch(err => console.log(err));
    }

    createRespond()
    {
        this.newPost = new Post( this.newHeading, 0, [], this.tags, this.idForMe, this.newContent, this.sm_moduleName, 'uXXXXXXXX', null, true, '');
        this._mediatorService.createResponce(this.idForMe, this.newPost)
            .then(status => {this.setResponses(this.idForMe);})
            .catch(err => console.log(err));

    }

    createThread()
    {
        this.newPost = new Post( this.newHeading, 0, [], this.tags, null, this.newContent, this.sm_moduleName, 'uXXXXXXXX', null, true, '');
        this._mediatorService.createThread('xoxoxo', this.newPost)
            .then(status => {this.getAllPosts(this.sm_moduleName);})
            .catch(err => console.log(err));

    }

    restToDash(comp_desc: string)
    {
        let i = this.nb_comp_ids.indexOf(comp_desc);
        this.nb_comp_ids.splice(i, 1);
    }

    addToNav(comp_id: string)
    {
        this.nb_comp_ids.push(comp_id);
        if (comp_id === "mess"){
            document.getElementById( 'comments' ).style.top = '10%';
            document.getElementById( 'comments' ).style.top = '90%';
        }
        if (comp_id === "comments"){
            document.getElementById( 'message' ).style.top = '10%';
            document.getElementById( 'comments' ).style.top = '90%';
        }
    }

    likedPost()
    {
        let myObj = { postID: this.idForMe, student_number: this.user_Id};

        this._mediatorService.upVote('xoxoxo', myObj)
            .then(status => {this.loadUpVotes(this.idForMe);})
            .catch(err => console.log(err));
    }

    dislikedPost()
    {
        let myObj = { postID: this.idForMe, student_number: this.user_Id};

        this._mediatorService.downVote('xoxoxo', myObj)
            .then(status => {this.loadDownVotes(this.idForMe);})
            .catch(err => console.log(err));
    }

    loadUpVotes(x: string)
    {
        this._mediatorService.getUpVotes(x)
            .then(upVotes => this.upVotes = upVotes)
            .catch(err => console.log(err));

    }

    loadDownVotes(x: string)
    {
        this._mediatorService.getDownVotes(x)
            .then(downVotes => this.downVotes = downVotes)
            .catch(err => console.log(err));
    }

    dummyData()
    {
        this.sm_Posts = [{heading: "A", postID: "a"},{heading: "B", postID: "b"},{heading: "C",postID: "c"},{heading: "D",postID: "d"}];
        this.sp_Posts = [{heading: "A", postID: "a"},{heading: "B", postID: "b"},{heading: "C",postID: "c"},{heading: "D",postID: "d"}];
        this.co_Posts = [{heading: "E", postID: "e"},{heading: "F", postID: "f"},{heading: "G",postID: "g"},{heading: "H",postID: "h"}];
    }
}

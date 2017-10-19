import { Component } from '@angular/core';
import {Post} from './post';
import {MediatorService} from "./mediator.service";
import {KontrollerService} from "./kontroller.service";
import {SuperPost} from "./super-post";
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';
// import Button from '/public/src/assets';
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

    // showDialog() {
    //     this.display = true;
    // }
    user_Id = '';
    user_password = '';
    sm_moduleName: string = '';
    //Remember COS101 is not integrated yet to other components

    garbage;
    app_module: string = '';
    app_content: string = '';
    user_bounty = 321;
    user_points = 1245;
    newPost: Post;
    userObject = [];
    sm_Posts = [];
    sp_Posts= [];
    rp_Posts= [];
    mess_Post= null;
    co_Posts = [];
    idForMe : string = "";
    responseDialog = [];
    tags: Array<String> = [];
    nav_crums = [];
    level: Number;
    newContent: string = '';
    newHeading: string = '';
    upVotes = 0;
    downVotes = 0;
    app_growlAlert = [];
    constructor(private _mediatorService: MediatorService,
                private troll: KontrollerService){}
    nb_comp_ids: Array<String> = [];
    group_timer;
    dashboard_timer;
    profile_timer;
    private timer;
    createNewModule(){
    }

    login_Attempt(usrId: string, usrPswrd: string)
    {
        // console.log("userId:"+usrId+"UserPsswrd: "+usrPswrd);
        // this.userObject = [];
        while (this.userObject.length > 0)
        {
            this.userObject.pop();
        }
        this._mediatorService.login({userID: usrId, password: usrPswrd})
            .then(userObject => {this.userObject.push(userObject); this.authenticatePassword()})
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
        this.user_Id = "";
        this.user_Id = "";
        sessionStorage.removeItem("sessionID");
        console.log('sessionId after log out'+ sessionStorage.getItem("sessionID"));
        this.sm_moduleName = "";
        this.resetTextFields();
        this.dashBored();
    }

    refresh_dashboard()
    {
        if (sessionStorage.getItem("sessionID"))
        {
            this.getAllPosts(this.sm_moduleName);
            this.setRecentPosts(this.sm_moduleName);
        }

        if (this.idForMe != "" && sessionStorage.getItem("sessionID"))
        {
            this.x_setSibs(this.idForMe);
            this.setResponses(this.idForMe);
            this.loadUpVotes(this.idForMe);
            this.loadDownVotes(this.idForMe);

        }
    }

    timer_Shifted(i: number)
    {
        // if (i == 1)
        //     group_timer;
    }

    dashBored()
    {
        if (sessionStorage.getItem("sessionID"))
        {
            // alert("LOGGED IN as: "+sessionStorage.getItem("sessionID"))
            this._mediatorService.getUser(sessionStorage.getItem("sessionID"))
                .then(userObject => {this.userObject = userObject; this.toDashBoard()})
                .catch(err => console.log(err));

        }
        else
        {
            document.getElementById('id_dashboard').style.display = 'none';
            document.getElementById('div_breadCrums').style.display = 'none';
            document.getElementById('id_login').style.display = 'inline';
        }
    }


    toDashBoard()
    {
        if(this.userObject.length > 0)
        {
            if (this.sm_moduleName == "" && this.userObject && this.userObject.length > 0)
                this.sm_moduleName = this.userObject[0].modules[0];
            this.dashboard_timer = setInterval(() => {
                this.refresh_dashboard();
            }, 7000);
        }
        else
            return;
        this.getAllPosts(this.sm_moduleName);
        document.getElementById('id_dashboard').style.display = 'inline';
        // document.getElementById('div_breadCrums').style.display = 'inline';
        document.getElementById('id_login').style.display = 'none';
        this.user_Id = sessionStorage.getItem("sessionID");
    }


    toProfile()
    {
    }

    getAllPosts(x: string )
    {
        //XOXO

        this._mediatorService.getLevelZeros(x)
            .then(sm_Posts => this.sm_Posts = sm_Posts)
            .catch(err => console.log(err));

    }

    switchModules(p: string)
    {
        this.idForMe = "";
        this.mess_Post = null;
        this.sm_moduleName = p;
        this.resetTextFields();
        this.getAllPosts(p);
    }

    resetTextFields()
    {
        for (let i =0; 0 < this.sm_Posts.length; i++)
            this.sm_Posts.pop();
        for (let i =0; 0 < this.co_Posts.length; i++)
            this.co_Posts.pop();
        for (let i =0; 0 < this.sp_Posts.length; i++)
            this.sp_Posts.pop();
        for (let i =0; 0 < this.rp_Posts.length; i++)
            this.rp_Posts.pop();
        // for (let i =0; 0 < this.nav_crums.length; i++)
        //     this.nav_crums.pop();

        this.idForMe = "";
        this.mess_Post = null;
    }

    populatePostOffice(x: SuperPost,  x_list: Array<Post>, v : number)
    {

    }

    setSibs(choosenId: string, pHeading: string)
    {
        // this.nav_crums = [];
        // this.nav_crums.push({heading: pHeading,postId: choosenId});
        this.x_setSibs(choosenId);
        this.x_setMessage(choosenId);
    }

    x_setSibs(choosenId: string)
    {
        // this.sp_Posts = [];
        this._mediatorService.getSiblingPosts(choosenId, sessionStorage.getItem("sessionID"))
        // .then(sp_Posts => {this.sp_Posts = sp_Posts; if (this.sp_Posts.length == 0) this.noChildrenLevelZero(choosenId);})
            .then(sp_Posts => this.sp_Posts = sp_Posts)
            .catch(err => console.log(err));
    }

    setMessage(choosenId: string, heading: string, level: number)
    {
        // for( ; level < this.nav_crums.length; )
        //     this.nav_crums.pop();
        // this.nav_crums.splice(level, this.nav_crums.length - level)
        // this.nav_crums.push({heading: heading,postId: choosenId});

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
            .then(mess_Post => {
                this.mess_Post = mess_Post;
            if (this.mess_Post.status == true)
            {
                this.loadImage();
                           }
            })
            .catch(err => console.log(err));
        this.setResponses(choosenId);
        this.loadUpVotes(choosenId);
        this.loadDownVotes(choosenId);

        this.troll.setUserPicture(this.mess_Post.photo);
    }

    loadImage()
    {
        (<HTMLInputElement>document.getElementById("phody")).style.backgroundImage = "url(../assets/UserProfilePictures/"+this.mess_Post.photoID+")";

        //(<HTMLInputElement>document.getElementById("phody")).style.backgroundImage = "url(../assets/UserProfilePictures/"+this.mess_Post.photoID+")";
        // alert((document.getElementById("phody")).style.backgroundImage = "url(../assets/UserProfilePictures/"+this.mess_Post.photoID+")";
    }
    setMessage2(choosenId: string, heading: string, level: number)
    {
        // for (let i =0; 0 < this.sp_Posts.length; i++)
        //     this.sp_Posts.pop();
        this.setMessage(choosenId, heading, level);
        this.x_setSibs(choosenId);
    }

    setResponses(choosenId: string)
    {
        this._mediatorService.getChildPosts(choosenId, sessionStorage.getItem("sessionID"))
            .then(co_Posts => this.co_Posts = co_Posts)
            .catch(err => console.log(err));
    }

    setRecentPosts(moduCode: string)
    {
        this._mediatorService.getRecentPosts(this.sm_moduleName)
            .then(rp_Posts => this.rp_Posts = rp_Posts)
            .catch(err => console.log(err));
    }

    createRespond()
    {
        if (this.newContent.length == 0)
        {
            this.app_growlAlert.push({severity:'error', summary:'Error Message', detail:'Trying to make a post with no content'});
            this.timer = setTimeout(() => {
                this.app_growlAlert.pop();
            }, 4000);
            return;
        }
        this.newPost = new Post( this.newHeading, 0, [], this.tags, this.idForMe, this.newContent, this.sm_moduleName, sessionStorage.getItem("sessionID"), null, true, '');
        this._mediatorService.createResponce(this.idForMe, this.newPost)
            .then(status => {this.setResponses(this.idForMe);})
            .catch(err => console.log(err));
        this.newHeading = "";
        this.newContent = "";

    }

    createThread()
    {
        if (this.newContent.length == 0 || this.newHeading.length == 0)
        {
            this.app_growlAlert.push({severity:'error', summary:'Error Message', detail:'Trying to make a post with no content'});
            this.timer = setTimeout(() => {
                this.app_growlAlert.pop();
            }, 4000);
            return;
        }
        this.newPost = new Post( this.newHeading, 0, [], this.tags, null, this.newContent, this.sm_moduleName, sessionStorage.getItem("sessionID"), null, true, '');
        this._mediatorService.createThread('xoxoxo', this.newPost)
            .then(status => {this.getAllPosts(this.sm_moduleName);})
            .catch(err => console.log(err));
        this.newHeading = "";
        this.newContent = "";

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

    removePost(x: String)
    {
        let p = {postID: this.idForMe};
        this._mediatorService.removePost(p)
            .then(garbage => {this.garbage = garbage; this.idForMe =""; this.mess_Post = null;})
            .catch(err => console.log(err));
    }

    dummyData()
    {
        this.mess_Post = {"status":true,"content":"Test 01","text":"Found the post","timestamp":"10/16/2017, 9:23:38 AM","studentID":"Vreda","heading":"Testing Stats","tag_list":[],"photoID":"131.png"};
        this.userObject = [{"_id":"59bac4d6d3ab7929b4f74f68","userID":"u15478012","title":"Mr","initials":"HLP","surname":"Trunks","email":"that@tings.com","pseodoname":"Brody","modules":["COS 555","COS 333","COS 777","COS 000"]}];
        this.sm_Posts = [{"heading":"DEMO Day","postID":"59cbb33bde7ad10d006ac41b","level":0},{"heading":"Suggestions","postID":"59cba78ade7ad10d006ac414","level":0},{"heading":"Trail run","postID":"59ca3bbc1c462b0021168baa","level":0},{"heading":"u15478012_Thread","postID":"59ca1c1657036a2700120618","level":0},{"heading":"LDAP","postID":"59c92fa07ca8ef0021893334","level":0},{"heading":"Buzz UI","postID":"59c92e177ca8ef002189332f","level":0},{"heading":"DS","postID":"59acfc445b6f332c1cdc2c5b","level":0},{"heading":"AA","postID":"59ac916c4cf3281a000a9dcc","level":0},{"heading":"Fitchfork","postID":"599fc7c9ae6ed2154805987e","level":0},{"heading":"Practical Assignments","postID":"599fc7c9ae6ed2154805987d","level":0}];
        this.sp_Posts = [{"heading":"DEMO XXXXXXXXXXX","postID":"59cbb33bde7ad10d006ac41b","userID":"uXXXXXXXX","timestamp":"2017-09-20T14:18:35.035Z"},{"heading":"Suggestions","postID":"59cba78ade7ad10d006ac414","userID":"uXXXXXXXX","timestamp":"2017-09-27T13:28:42.434Z"},{"heading":"Trail run","postID":"59ca3bbc1c462b0021168baa","userID":"uXXXXXXXX","timestamp":"2017-09-26T11:36:28.182Z"},{"heading":"u15478012_Thread","postID":"59ca1c1657036a2700120618","userID":"uXXXXXXXX","timestamp":"2017-09-26T09:21:26.368Z"},{"heading":"LDAP","postID":"59c92fa07ca8ef0021893334","userID":"uXXXXXXXX","timestamp":"2017-09-25T16:32:32.453Z"},{"heading":"Buzz UI","postID":"59c92e177ca8ef002189332f","userID":"uXXXXXXXX","timestamp":"2017-09-25T16:25:59.645Z"},{"heading":"DS","postID":"59acfc445b6f332c1cdc2c5b","userID":"uXXXXXXXX","timestamp":"2017-09-04T07:09:56.564Z"},{"heading":"AA","postID":"59ac916c4cf3281a000a9dcc","userID":"uXXXXXXXX","timestamp":"2017-09-03T23:34:04.516Z"},{"heading":"Fitchfork","postID":"599fc7c9ae6ed2154805987e","userID":"a001","timestamp":"2017-08-25T06:46:33.031Z"},{"heading":"Practical Assignments","postID":"599fc7c9ae6ed2154805987d","userID":"a001","timestamp":"2017-08-25T06:46:33.026Z"}];
        this.co_Posts = [{"postID":"599fc7c9ae6ed215480598ad","heading":"Getting 0","level":1},{"postID":"599fc7c9ae6ed215480598b0","heading":"Minus 1","level":1},{"postID":"599fc7c9ae6ed215480598b3","heading":"Not getting full marks","level":1},{"postID":"599fc7c9ae6ed215480598b6","heading":"File too big","level":1},{"postID":"599fc7c9ae6ed215480598be","heading":"Possible Solution to Fitchfork criteria?","level":1},{"postID":"599fc7c9ae6ed215480598bf","heading":"Which attempt counts?","level":1},{"postID":"599fc7c9ae6ed215480598c6","heading":"Deleting wrong uploaded tasks","level":1},{"postID":"599fc7c9ae6ed215480598c8","heading":"Uploading Tasks","level":1},{"postID":"599fc7c9ae6ed215480598cb","heading":"Fitchfork marks","level":1},{"postID":"599fc7c9ae6ed215480598d0","heading":"Checking and correcting mistakes","level":1},{"postID":"599fc7c9ae6ed215480598d5","heading":"Checking and correcting mistakes","level":1},{"postID":"599fc7c9ae6ed215480598da","heading":"Fast but much too strict","level":1},{"postID":"599fc7c9ae6ed215480598e2","heading":"From bad to worse","level":1},{"postID":"599fc7c9ae6ed215480598ec","heading":"aploading prac2 task4","level":1},{"postID":"59d636bd6c99af715b231ce2","heading":"Timeout Exception","level":1,"visibility":true}];
        this.rp_Posts = [{"postID":"59cbb4a9de7ad10d006ac41e","heading":"Security Aspect","level":1},{"postID":"59cbb44ede7ad10d006ac41d","heading":"Chill Lounge","level":1},{"postID":"59cbb3fade7ad10d006ac41c","heading":"Usability testing","level":1},{"postID":"59cbb33bde7ad10d006ac41b","heading":"DEMO Day","level":0},{"postID":"59cbac40de7ad10d006ac41a","heading":"Chat rooms","level":1}];
        // (<HTMLInputElement>document.getElementById("phody")).style.backgroundImage = "/public/src/assets/UserProfilePictures/"+this.mess_Post.photoID;
        (<HTMLInputElement>document.getElementById("phody")).style.backgroundImage = "url(../assets/UserProfilePictures/"+this.mess_Post.photoID+")";

        this.sm_moduleName = this.userObject[0].modules[0];
    }



    data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',"XXXX"],
        datasets: [
            {
                label: 'First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'Second Dataset',
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    }

    options = {
        title: {
            display: true,
            text: 'My Title',
            fontSize: 16
        },
        legend: {
            position: 'bottom'
        }
    };

}

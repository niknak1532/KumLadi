import { Component, OnInit, Input } from '@angular/core';
import {KontrollerService} from "../kontroller.service";
import {MediatorService} from "../mediator.service";
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  constructor(private _kontrolService: KontrollerService, private _mediatorService: MediatorService) { }
    @Input() userObject;//Dont use this
    display: boolean = false;
    confirm_payment: boolean = false;
    userId: string = "";
    groupName: string = "";
    groupNameView: string = "";
    myGroups = [];
    // groupInfo = null ;
    groupInfo = null;
    gr_messages = [];
    gr_pseudonames = [];
    newMeber: string = "";
    gr_response: string = "";
    private timer;
    private timerMessages;
    growlAlert = [];
    showDialog() {
        this.display = true;
    }


    ngOnInit() {
        this.timer = setInterval(() => {
            this.refresh_MyGroups();
        }, 2000);
  }

  refresh_MyGroups(){

      if (this.display == true && sessionStorage.getItem("sessionID"))
      {
          // alert("Called refreshMyGroups n sessionID set");
          this._kontrolService.groupsJoined(sessionStorage.getItem("sessionID"))
              .then(myGroups => this.myGroups = myGroups)
              .catch(err => console.log(err));

          this.userId = sessionStorage.getItem("sessionID");

          if (this.groupInfo != null)
          this._kontrolService.getGroupMessages(this.groupInfo._id)
              .then(gr_messages => this.gr_messages = gr_messages)
              .catch(err => console.log(err));
      }
      else
      {

      }
  }

  createGroup()
  {
      this.groupName = this.groupNameView;
      // alert("Decision: "+this.confirm_payment+" |||GroupName: "+this.groupNameView);
    if(sessionStorage.getItem("sessionID") && this.confirm_payment)
    {
        this._kontrolService.createGroup({initiator: sessionStorage.getItem("sessionID"), peers : [], groupName: this.groupNameView})
            .then(status => {this.hide_createGroup();})
            .catch(err => console.log(err));
        document.getElementById("gr_div_createGroup").style.display = "none";
    }
    else
    {
      // alert("Sorry, Unable to Create Group. ");
    }
  }

  addToGroup()
  {
      // this.hide_addMember();
      // alert("Hey");
      this._kontrolService.getBasicUserInfo(this.newMeber)
          .then(status => { if (status){ this.appendNewMember(this.newMeber);}})
          .catch(err => console.log(err));
  }

  appendNewMember(joinee: string)
  {
      // this.hide_addMember();
      // alert("Hey");
      this._kontrolService.joinGroup({ peers : [joinee], groupName: this.groupName})
          .then(status => { if (status){this.hide_addMember();}})
          .catch(err => console.log(err));

      this.selectedGroup(this.groupName);
  }

    selectedGroup(p1: string)
    {
        this.groupName = p1;
        this._kontrolService.getGroupInformation(this.groupName)
            .then(groupInfo => {this.groupInfo = groupInfo; this.refresh_MyGroups()})
            .catch(err => console.log(err));
    }

    gr_create_post(id : string)
    {

        this._kontrolService.createMessage({groupID: id, student_number : sessionStorage.getItem("sessionID"), message: this.gr_response})
            .then(status => {this.gr_response = "";})
            .catch(err => console.log(err));
    }


    hide_addMember()
    {
        document.getElementById('gr_div_addToGroup').style.display = "none";
        this.growlAlert.push({severity:'success', summary:'Success Message', detail:'Added User'});
        this.timer = setTimeout(() => {
            this.growlAlert.pop();
        }, 3000);
    }

    hide_createGroup()
    {
        document.getElementById('gr_div_addToGroup').style.display = "none";
        this.growlAlert.push({severity:'success', summary:'Success Message', detail:'Created Group'});
        this.timer = setTimeout(() => {
            this.growlAlert.pop();
        }, 3000);
    }

}

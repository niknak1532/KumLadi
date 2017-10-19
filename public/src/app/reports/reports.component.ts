import { Component, OnInit, Input } from '@angular/core';
import {MediatorService} from "../mediator.service";
import {KontrollerService} from "../kontroller.service";
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
    @Input() userObject;
    @Input() sm_moduleName;
    display: boolean = false;
    panel_heading: string = "Profile";
    repo_stats = null;
    dummy_Adaptor = [];
    dummy_leader = [];
    userRank = null;
    gami_stats = [];
    rep_leaderBoards = [{"userID":[],"total":[],"points":[], "bounty":[]}];
    transition_stats = {"modules":[],"dataNumOfPosts":[],"dataNumOfVotes":[], "numUpVotes":[],"numDownVotes":[]};
    tbl_format = {"modules":[],"dataNumOfPosts":[],"dataNumOfVotes":[], "numUpVotes":[],"numDownVotes":[]};
    tbl_format_lb = [{"userID":[],"total":[],"points":[], "bounty":[]}];

    private timer;
    constructor(private _kontrolService: KontrollerService, private _mediatorService: MediatorService) { }

    showDialog() {
        this.display = true;
    }

    getReports(x)
    {
        switch (x)
        {
            case 1: this.panel_heading = 'Profile';
                (<HTMLInputElement>document.getElementById("rep_profile")).style.display = "block";
                (<HTMLInputElement>document.getElementById("rep_gami2")).style.display = "none";
                (<HTMLInputElement>document.getElementById("rep_mile")).style.display = "none";
                (<HTMLInputElement>document.getElementById("rep_stats")).style.display = "none";
                (<HTMLInputElement>document.getElementById("rep_subs")).style.display = "none";
                (<HTMLInputElement>document.getElementById("rep_leaderBoards")).style.display = "none";
                break;
            case 2: this.panel_heading = 'Subscriptions';
                document.getElementById("rep_subs").style.display = "block";
                document.getElementById("rep_profile").style.display = "none";
                document.getElementById("rep_mile").style.display = "none";
                document.getElementById("rep_stats").style.display = "none";
                document.getElementById("rep_gami2").style.display = "none";
                document.getElementById("rep_leaderBoards").style.display = "none";
                break;
            case 3: this.panel_heading = 'Gamification';
                (<HTMLInputElement>document.getElementById("rep_gami2")).style.display = "block";
                document.getElementById("rep_profile").style.display = "none";
                document.getElementById("rep_mile").style.display = "none";
                document.getElementById("rep_stats").style.display = "none";
                document.getElementById("rep_subs").style.display = "none";
                document.getElementById("rep_leaderBoards").style.display = "none";
                break;
            case 4: this.panel_heading = 'MileStones';
                document.getElementById("rep_mile").style.display = "block";
                document.getElementById("rep_profile").style.display = "none";
                document.getElementById("rep_gami2").style.display = "none";
                document.getElementById("rep_stats").style.display = "none";
                document.getElementById("rep_subs").style.display = "none";
                document.getElementById("rep_leaderBoards").style.display = "none";
                break;
            case 5: this.panel_heading = 'Statistics';
                (<HTMLInputElement>document.getElementById("rep_stats")).style.display = "block";
                (<HTMLInputElement>document.getElementById("rep_profile")).style.display = "none";
                (<HTMLInputElement>document.getElementById("rep_subs")).style.display = "none";
                (<HTMLInputElement>document.getElementById("rep_mile")).style.display = "none";
                (<HTMLInputElement>document.getElementById("rep_gami2")).style.display = "none";
                (<HTMLInputElement>document.getElementById("rep_leaderBoards")).style.display = "none";
                break;
            case 6: this.panel_heading = 'Statistics';
                (<HTMLInputElement>document.getElementById("rep_leaderBoards")).style.display = "block";
                (<HTMLInputElement>document.getElementById("rep_stats")).style.display = "none";
                (<HTMLInputElement>document.getElementById("rep_profile")).style.display = "none";
                (<HTMLInputElement>document.getElementById("rep_subs")).style.display = "none";
                (<HTMLInputElement>document.getElementById("rep_mile")).style.display = "none";
                (<HTMLInputElement>document.getElementById("rep_gami2")).style.display = "none";
                break;
        }
    }

  ngOnInit() {
      this.timer = setInterval(() => {
          this.rep_leaderBoards_getter();
      }, 6000);
  }

    refresh_MyReports()
    {
        if (this.display == true)
        {
            this.rep_gami_stats();
            // this.rep_gami_stats();
        }
        if (!sessionStorage.getItem("sessionID"))
        {
            this.repo_stats = null;
            this.display = false;
        }
    }

    manual_refresh()
    {
        if (this.display == true)
        {
            this.statsPerModule();
        }
        if (!sessionStorage.getItem("sessionID"))
        {
            this.repo_stats = null;
            this.display = false;
        }
    }

    rep_gami_stats()
    {
        this._kontrolService.getUserPoints(sessionStorage.getItem("sessionID"))
            .then(repo_stats => {this.repo_stats = repo_stats; this.calculateLevel()})
            .catch(err => console.log(err));
    }

    rep_leaderBoards_getter()
    {
        if (this.display == true)
        this._kontrolService.leaderBoard("COS101")
            .then(dummy_leader => {this.dummy_leader = dummy_leader; this.translate_LeaderBoard()})
            .catch(err => console.log(err));
    }
    calculateLevel()
    {
        let ranking = [{goal: 50, desc: "Variable"},
            {goal: 100, desc: "Function"},
            {goal: 200, desc: "Class"},
            {goal: 400, desc: "Library"},
            {goal: 1000, desc: "Language"}];
        let max_index = 0;
        for(let i = 0; i < ranking.length; i++)
            if (this.repo_stats.points >= ranking[i].goal)
            {
                max_index = i;
            }

        this.userRank = ranking[max_index];
        this.userRank.goal *= 2;
        let ratio =  (this.repo_stats.points/this.userRank.goal)*100;
        (<HTMLInputElement>document.getElementById("div_progressBar")).style.width = ratio.toString()+ "%";
    }


  statsPerModule()
  {
      this.dummy_Adaptor = [];
      if (this.userObject.length > 0)
      // for (let i = 0; i < this.userObject.modules.length; i++ )
      {
          this._kontrolService.attempt(sessionStorage.getItem("sessionID"))
              .then(dummy_Adaptor => {
                  this.dummy_Adaptor = dummy_Adaptor;
                  this.toTableFormat()
              })
              .catch(err => console.log(err));
      }

  }
//[[{"numPosts":0,"module":"Buzz"},{"numPosts":0,"module":"COS101"},{"numPosts":0,"module":"COS121"},{"numPosts":1,"module":"KumLadi"}]
// ,[{"numVotes":0,"numUpVotes":0,"numDownVotes":0,"module":"COS121"},{"numVotes":0,"numUpVotes":0,"numDownVotes":0,"module":"COS101"}
// ,{"numVotes":0,"numUpVotes":0,"numDownVotes":0,"module":"Buzz"},{"numVotes":1,"numUpVotes":1,"numDownVotes":0,"module":"KumLadi"}]]}

    toTableFormat()
    {
        if (this.dummy_Adaptor.length == 0)
            return ;

        for (let i = 0; i < this.dummy_Adaptor[0].length; i++)
        {
            if (this.transition_stats.modules.indexOf(this.dummy_Adaptor[0][i].module) < 0)
            {
                this.transition_stats.modules.push(this.dummy_Adaptor[0][i].module);
                let spot = this.transition_stats.modules.indexOf(this.dummy_Adaptor[0][i].module);
                this.transition_stats.dataNumOfPosts[spot] = (this.dummy_Adaptor[0][i].numPosts);
            }
        }
        this.transition_stats.modules.sort();
        for (let i = 0; i < this.transition_stats.modules.length; i++)
        {
            let spot = this.transition_stats.modules.indexOf(this.dummy_Adaptor[1][i].module);
            if (spot < 0)
                return ;
            this.transition_stats.numUpVotes[spot] = (this.dummy_Adaptor[1][i].numUpVotes);
            this.transition_stats.numDownVotes[spot] = (this.dummy_Adaptor[1][i].numDownVotes);
            this.transition_stats.dataNumOfVotes[spot] = (this.dummy_Adaptor[1][i].numVotes);
        }
        this.tbl_format.modules = this.transition_stats.modules;
        this.tbl_format.dataNumOfPosts = this.transition_stats.dataNumOfPosts;
        this.tbl_format.dataNumOfVotes = this.transition_stats.dataNumOfVotes;
        this.tbl_format.numUpVotes = this.transition_stats.numUpVotes;
        this.tbl_format.numDownVotes = this.transition_stats.numDownVotes;

        this.data = {
            labels: this.tbl_format.modules,
            datasets: [
                {
                    label: 'Posts',
                    backgroundColor: '#2FFFF5',
                    data: this.tbl_format.dataNumOfPosts
                },
                {
                    label: 'Votes Made',
                    backgroundColor: '#4AA5A5',
                    data: this.tbl_format.dataNumOfVotes
                },
                {
                    label: 'DownVotes',
                    backgroundColor: '#42A5F5',
                    data: this.tbl_format.numDownVotes
                },
                {
                    label: 'Upvotes',
                    backgroundColor: '#5555F5',
                    data: this.tbl_format.numUpVotes
                }
            ]
        }
    }
    //[{"userID":"u12345678","total":0,"points":0,"bounty":0},
    // {"userID":"u12077420","points":1000,"total":10000,"bounty":0},
    // {"userID":"u13247914","total":10000,"points":1000,"bounty":0},
    // {"userID":"u15110045","bounty":0,"points":1000,"total":10000},
    // {"userID":"Vreda","bounty":0,"points":1000,"total":10000},
    // {"userID":"u13010931","points":1000,"total":10000,"bounty":0},
    // {"userID":"u12138747","total":0,"bounty":0,"points":0},
    // {"userID":"u30010113","bounty":0,"total":0,"points":0}]
    translate_LeaderBoard()
    {
        if (this.tbl_format_lb.length == 1)
            this.tbl_format_lb.pop();
        for (let i = 0; this.tbl_format_lb.length < this.dummy_leader.length; i++)
        {
            this.tbl_format_lb.push(this.dummy_leader[i]);
        }
    }

    data = {
        labels: this.tbl_format.modules,
        datasets: [
            {
                label: 'Posts',
                backgroundColor: '#2FFFF5',
                data: this.tbl_format.dataNumOfPosts
            },
            {
                label: 'Votes',
                backgroundColor: '#42A5F5',
                data: this.tbl_format.dataNumOfVotes
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

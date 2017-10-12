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
    // @Input() rep_dia_display;
    // @Input() display;
    // currentOutFit = "H1U1B1.png";
    // Hair_val = 1;
    // Upper_val = 1;
    // Bottom_val = 1;
    display: boolean = false;
    panel_heading: string = "Profile";
    repo_stats = null;
    dummy_Adaptor = [];
    userRank = null;
    gami_stats = [];
    transition_stats = {"modules":[],"dataNumOfPosts":[],"dataNumOfVotes":[]};
    tbl_format = {"modules":[],"dataNumOfPosts":[],"dataNumOfVotes":[]};
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
                document.getElementById("rep_profile").style.display = "block";
                document.getElementById("rep_gami2").style.display = "none";
                document.getElementById("rep_mile").style.display = "none";
                document.getElementById("rep_stats").style.display = "none";
                document.getElementById("rep_subs").style.display = "none";
                break;
            case 2: this.panel_heading = 'Subscriptions';
                document.getElementById("rep_subs").style.display = "block";
                document.getElementById("rep_profile").style.display = "none";
                document.getElementById("rep_mile").style.display = "none";
                document.getElementById("rep_stats").style.display = "none";
                document.getElementById("rep_gami2").style.display = "none";
                break;
            case 3: this.panel_heading = 'Gamification';
                document.getElementById("rep_gami2").style.display = "block";
                document.getElementById("rep_profile").style.display = "none";
                document.getElementById("rep_mile").style.display = "none";
                document.getElementById("rep_stats").style.display = "none";
                document.getElementById("rep_subs").style.display = "none";
                break;
            case 4: this.panel_heading = 'MileStones';
                document.getElementById("rep_mile").style.display = "block";
                document.getElementById("rep_profile").style.display = "none";
                document.getElementById("rep_gami2").style.display = "none";
                document.getElementById("rep_stats").style.display = "none";
                document.getElementById("rep_subs").style.display = "none";
                break;
            case 5: this.panel_heading = 'Statistics';
                document.getElementById("rep_stats").style.display = "block";
                document.getElementById("rep_profile").style.display = "none";
                document.getElementById("rep_subs").style.display = "none";
                document.getElementById("rep_mile").style.display = "none";
                document.getElementById("rep_gami2").style.display = "none";
                break;
        }
    }

  ngOnInit() {
      this.timer = setInterval(() => {
          this.refresh_MyReports();
      }, 6000);
  }

    refresh_MyReports()
    {
        if (this.display == true)
        {
            this.statsPerModule();
            this.rep_gami_stats();
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
    calculateLevel()
    {
        let ranking = [{goal: 50, desc: "Const Variable"}, {goal: 100, desc: "Dynamic Variable"}, {goal: 200, desc: "Structure"},{goal: 400, desc: "Class"},{goal: 1000, desc: "Language"}];
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
      // let min = 0;
      // while ( min < this.dummy_Adaptor.length)
      // {
      //     this.dummy_Adaptor.pop();
      // }
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
//[[{"numPosts":0,"module":"Buzz"},{"numPosts":4,"module":"COS121"}]
// ,[{"numVotes":0,"module":"Buzz"},{"numVotes":1,"module":"COS121"}]]
    toTableFormat()
    {
        if (this.dummy_Adaptor.length == 0)
            return ;

        for (let i = 0; 0 < this.tbl_format.modules.length; i++)
            this.transition_stats.modules.pop();
        for (let i = 0; 0 < this.tbl_format.dataNumOfPosts.length; i++)
            this.transition_stats.dataNumOfPosts.pop();
        for (let i = 0; 0 < this.tbl_format.dataNumOfVotes.length; i++)
            this.transition_stats.dataNumOfVotes.pop();

        for (let i = 0; i < this.dummy_Adaptor[0].length; i++)
        {
            this.transition_stats.modules.push(this.dummy_Adaptor[0][i].module);
            this.transition_stats.dataNumOfPosts.push(this.dummy_Adaptor[0][i].numPosts);
            this.transition_stats.dataNumOfVotes.push(this.dummy_Adaptor[1][i].numVotes);
        }
        this.tbl_format.modules = this.transition_stats.modules;
        this.tbl_format.dataNumOfPosts = this.transition_stats.dataNumOfPosts;
        this.tbl_format.dataNumOfVotes = this.transition_stats.dataNumOfVotes;
        // for (let i = 0; i < this.dummy_Adaptor[0].length; i++) {
        // this.data.datasets[0].data =this.tbl_format.dataNumOfPosts;
        // this.data.labels =this.tbl_format.modules;
        // this.data.datasets[1].data =this.tbl_format.dataNumOfVotes;

        this.data = {
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
        // }
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

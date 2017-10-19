import { Component, OnInit } from '@angular/core';
import {INglDatatableSort, INglDatatableRowClick} from 'ng-lightning/ng-lightning';
import {KontrollerService} from "../kontroller.service";
@Component({
  selector: 'app-admininterface',
  templateUrl: './admininterface.component.html',
  styleUrls: ['./admininterface.component.css']
})
export class AdmininterfaceComponent implements OnInit {
    display: boolean = false;
    private timer;
    admin_Obj = [];
    admin_selected_module = "";
    ad_allUsers = {name: [], surname:[], userID: [], posts: [], upVotes: [], downVotes:[],points:[]};
    tbl_format = {name: [], surname:[], userID: [], posts: [], upVotes: [], downVotes:[],points:[]};
    dummy_Adaptor = [{name: [], surname: [], userID: [], posts: [], upVotes: [], downVotes:[],points:[]}];
    // "data":[{"name":"Khaya","surname":"Lolly","userID":"u12345678","posts":1,"upVotes":0,"downVotes":0,"points":0}
    panel_heading: string = "Mile Stones";
    showDialog() {
        this.display = true;
    }
  constructor(private _kontrolService: KontrollerService) { }

    getReports(x)
    {
        switch (x)
        {
            case 1: this.panel_heading = 'Mile Stones';
                document.getElementById("ad_mileStones").style.display = "block";
                document.getElementById("ad_viewStats").style.display = "none";
                break;
            case 2: this.panel_heading = 'Admin Stats';
                document.getElementById("ad_viewStats").style.display = "block";
                document.getElementById("ad_mileStones").style.display = "none";
                break;
        }
    }

  ngOnInit() {
      this.timer = setInterval(() => {
          this.refresh_myAdmin();
      }, 6000);
  }

    selectedModule(x: string)
    {
        this.admin_selected_module = x;
    }

    refresh_myAdmin()
    {
        if (this.display == true && sessionStorage.getItem("sessionID"))
        {
            this.ad_get_adminModules();
        }
        //put this back
        // if (!sessionStorage.getItem("sessionID"))
        // {
        //     this.display = false;
        // }
    }

    ad_get_adminModules()
    {
        this._kontrolService.getUserStatus(sessionStorage.getItem("sessionID"))
            .then(admin_Obj => {
                this.admin_Obj = admin_Obj;
                this.ad_get_users();})
            .catch(err => console.log(err));


    }

    ad_get_users()
    {
        if (this.admin_selected_module != "")
        {
            this._kontrolService.courseStats(this.admin_selected_module)
                .then(data => {this.data  = data;})
                .catch(err => console.log(err));
        }
    }
    // "data":[{"name":"Khaya","surname":"Lolly","userID":"u12345678","posts":1,"upVotes":0,"downVotes":0,"points":0}
    toTableFormat()
    {
        // if (this.dummy_Adaptor.length == 0)
        //     return ;
        //
        // for (let i = 0; i < this.dummy_Adaptor.length; i++)
        // {
        //     {
        //         this.ad_allUsers.name[i] = (this.dummy_Adaptor[i].name);
        //         this.ad_allUsers.surname[i] = (this.dummy_Adaptor[i].surname);
        //         this.ad_allUsers.userID[i] = (this.dummy_Adaptor[i].userID);
        //         this.ad_allUsers.posts[i] = (this.dummy_Adaptor[i].posts);
        //         this.ad_allUsers.upVotes[i] = (this.dummy_Adaptor[i].upVotes);
        //         this.ad_allUsers.downVotes[i] = (this.dummy_Adaptor[i].downVotes);
        //         this.ad_allUsers.points[i] = (this.dummy_Adaptor[i].points);
        //     }
        // }
        // this.tbl_format.name = this.ad_allUsers.name;
        // this.tbl_format.surname = this.ad_allUsers.surname;
        // this.tbl_format.userID = this.ad_allUsers.userID;
        // this.tbl_format.posts = this.ad_allUsers.posts;
        // this.tbl_format.upVotes = this.ad_allUsers.upVotes;
        // this.tbl_format.downVotes = this.ad_allUsers.downVotes;
        // this.tbl_format.points = this.ad_allUsers.points;
    }

    reflect_users()
    {

    }

    xoxo_populate()
    {
        this.data = [{"name":"Khaya","surname":"Lolly","userID":"u12345678","upVotes":0,"points":0,"downVotes":0,"posts":1},
            {"name":"Nathi","surname":"Mothoa","userID":"u12077420","points":1000,"downVotes":0,"posts":0,"upVotes":0},
            {"name":"Nkosi","surname":"Ncube","userID":"u13247914","points":1000,"posts":0,"downVotes":0,"upVotes":0},
            {"name":"Nathan","surname":"Ngobale","userID":"u15110045","points":1000,"upVotes":0,"posts":1,"downVotes":0},
            {"name":"Vreda","surname":"Pieterse","userID":"Vreda","points":1000,"posts":1,"upVotes":0,"downVotes":0},
            {"name":"Kamogelo","surname":"Tsipa","userID":"u13010931","points":1000,"upVotes":0,"posts":4,"downVotes":0},
            {"name":"Melvin","surname":"Zitha","userID":"u12138747","points":0,"downVotes":0,"posts":0,"upVotes":0},
            {"name":"Junior,lect_cos456","userID":"u30010113","points":0,"posts":0,"upVotes":0,"downVotes":0}]
    }

  createMileStone = {milestoneName: "", description: "", reward: 0};
  //STARS
    value = 3;
    readonly = false;
    size = 'small';
    color = '#FFB75D';

  //TABLE

    ad_dataOptions = [
        {option_name: 'name', view: true},
        {option_name: 'surname', view: true},
        {option_name: 'userID', view: true},
        {option_name: 'posts', view: true},
        {option_name: 'upVotes', view: true},
        {option_name: 'downVotes', view: true},
        {option_name: 'points', view: true}
    ];

    DATA  = [];

    data = null;
    // Initial sort
    sort: INglDatatableSort = { key: 'rank', order: 'asc' };

    // Show loading overlay
    loading = false;

    // Toggle name column
    hideName = false;

    // Custom sort function
    onSort($event: INglDatatableSort) {
        const { key, order } = $event;
        this.data.sort((a: any, b: any) => {
            return (key === 'rank' ? b[key] - a[key] : b[key].localeCompare(a[key])) * (order === 'desc' ? 1 : -1);
        });
    }

    toggleData() {
        this.data = this.data ? null : this.DATA;
    }

    onRowClick($event: INglDatatableRowClick) {
        console.log('clicked row', $event.data);
    }
}






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
    ad_allUsers = [];
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

    refresh_myAdmin()
    {
        if (this.display == true && sessionStorage.getItem("sessionID"))
        {
            this.ad_get_adminModules();
            // this.rep_gami_stats();
        }
        if (!sessionStorage.getItem("sessionID"))
        {
            // this.repo_stats = null;
            this.display = false;
        }
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
            this._kontrolService.studentsInModule(this.admin_selected_module)
                .then(ad_allUsers => {this.ad_allUsers = ad_allUsers; this.reflect_users();})
                .catch(err => console.log(err));
        }
    }

    reflect_users()
    {
        if (this.ad_allUsers.length > this.DATA.length)
        {
            for (; this.ad_allUsers.length > this.DATA.length;)
            {
                this.DATA.push({ rank: 0, number: '0', surname: '0', likes: '0', dislikes: 0, responses: 0, bounty: 0, milestones: 0 });
            }

            for (let i = 0; i < this.DATA.length; i++)
            {
                this.DATA[i].number = this.ad_allUsers[i].userID;
            }
        }
        this.data = this.DATA;
    }

  createMileStone = {milestoneName: "", description: "", reward: 0};
  //STARS
    value = 3;
    readonly = false;
    size = 'small';
    color = '#FFB75D';

  //TABLE
    ad_dataOptions = [
        {option_name: 'number', view: true},
        {option_name: 'surname', view: true},
        {option_name: 'likes', view: true},
        {option_name: 'dislikes', view: true},
        {option_name: 'responses', view: true},
        {option_name: 'bounty', view: true},
        {option_name: 'milestones', view: true}
    ];

    DATA  = [
        { rank: 1, number: 'u12345678', surname: 'Abdul-Jabbar', likes: '38387', dislikes: 23, responses: 23, bounty: 12, milestones: 12 },
        { rank: 2, number: 'u23135463', surname: 'Malone', likes: '36928', dislikes: 12, responses: 23, bounty: 12, milestones: 12 },
        { rank: 3, number: 'u25746269', surname: 'Bryant', likes: '33643', dislikes: 16, responses: 12, bounty: 12, milestones: 12 },
        { rank: 4, number: 'u16452235', surname: 'Jordan', likes: '32292', dislikes: 54, responses: 12, bounty: 12, milestones : 12 },
        { rank: 5, number: 'u34254543', surname: 'Chamberlain', likes: '31419', dislikes: 10, responses: 12, bounty: 12, milestones: 12 },
    ];

    data = this.DATA;
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






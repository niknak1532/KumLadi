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






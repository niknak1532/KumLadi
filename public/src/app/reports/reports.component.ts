import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
    @Input() userObject;
    // @Input() rep_dia_display;
    // @Input() display;
    currentOutFit = "H1U1B1.png";
    Hair_val = 1;
    Upper_val = 1;
    Bottom_val = 1;
    display: boolean = false;
    panel_heading: string = "Profile";
    showDialog() {
        this.display = true;
    }

    getReports(x)
    {
        switch (x)
        {
            case 1: this.panel_heading = 'Profile';
                document.getElementById("rep_profile").style.display = "block";
                document.getElementById("rep_gami").style.display = "none";
                document.getElementById("rep_mile").style.display = "none";
                break;
            case 2: this.panel_heading = 'Subscriptions';
                break;
            case 3: this.panel_heading = 'Gamification';
                document.getElementById("rep_gami").style.display = "block";
                document.getElementById("rep_profile").style.display = "none";
                document.getElementById("rep_mile").style.display = "none";
                break;
            case 4: this.panel_heading = 'MileStones';
                document.getElementById("rep_mile").style.display = "block";
                document.getElementById("rep_profile").style.display = "none";
                document.getElementById("rep_gami").style.display = "none";
                break;
        }
    }

    // changeAttire(x)
    // {
    //     switch(x)
    //     {
    //         case 'H' :
    //             ++this.Hair_val;
    //             if (this.Hair_val > 2)
    //                 this.Hair_val = 1;
    //             this.currentOutFit  = "H"+this.Hair_val+"U"+this.Upper_val+"B"+this.Bottom_val+".png";
    //             break;
    //         case 'U' :
    //             ++this.Upper_val;
    //             if (this.Upper_val > 3)
    //                 this.Upper_val = 1;
    //             this.currentOutFit = "H"+this.Hair_val+"U"+this.Upper_val+"B"+this.Bottom_val+".png";
    //             break;
    //         case 'B' :
    //             ++this.Bottom_val;
    //             if (this.Bottom_val > 2)
    //                 this.Bottom_val = 1;
    //             this.currentOutFit = "H"+this.Hair_val+"U"+this.Upper_val+"B"+this.Bottom_val+".png";
    //             break;
    //     }
    // }

  constructor() { }

  ngOnInit() {
      this.data = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
  }

    data: any;


}

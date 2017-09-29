import {Post} from "./post";
import {MediatorService} from "./mediator.service";

export class SuperPost {



    constructor(
        public child_list: Array<Post> = [],
        public supers: Array<SuperPost> = [],
        private _mediatorService: MediatorService,
        private w: Array<Post>  = []
    )
    {  }

    populate(x_list: Array<Post>, v : number)
    {
        // if (v == 2)
        // {
        //     return ;
        // }
        // this.child_list = [];
        // this.supers = [];
        // for (var i = 0; i < x_list.length; i++)
        // {
        //     this.child_list.push(x_list[i]);
        //     this.supers.push(new SuperPost([],[],this._mediatorService));
        //     {
        //         // ;
        //         // let w : Post[] = new Array<Post>();
        //         console.log("P Called: "+ x_list[i].postID);
        //         this._mediatorService.getChildPosts("59a2c68c1ec68404e0615038")
        //             .then(w => w = w)
        //             .catch(err => console.log(err));
        //         ;
        //         if (this.w != null)
        //         console.log("W: "+JSON.stringify(this.w));
        //         console.log("W: "+this.w);
        //
        //         if (this.w != null && this.w.length > 0)
        //         {
        //             this.supers[i].populate(this.w, v++);
        //             console.log("Populate Clled");
        //         }
        //     }
        // }
    }


}


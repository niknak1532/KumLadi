export class Post {
    constructor(
        public heading: string = '',
        public level_number: Number,
        public child_list: Array<String> = [],
        public tag_list: Array<String> = [],
        public parent_ID: string = '',
        public content: string = '',
        public course_code: string = '',
        public student_number: string = '',
        public timestamp: Date,
        public visibility: Boolean,
        public postID: string = '',
    ) { console.log('Post object created\n\n'); }

    getChildren(x:string)
    {
        // console.log(this.heading+" PI:"+this.postID+" x:"+x);
        // var toReturn: CPU[] = null;
        // if (this.postID === x)
        // {
        //     console.log("SUCCESS");
        //     return this.children;
        // }
        // else {
        //     for (var i = 0 ; i < this.children.length; i++)
        //     {
        //         toReturn = this.children[i].getChildren(x);
        //         if (toReturn != null)
        //             break;
        //     }
        // }
        // return toReturn;
    }

    getMessage(x:string)
    {
        // console.log(this.heading+" PI:"+this.postID+" x:"+x);
        // var toReturn: CPU = null;
        // if (this.postID === x)
        // {
        //     console.log("SUCCESS");
        //     return this;
        // }
        // else {
        //     for (var i = 0 ; i < this.children.length; i++)
        //     {
        //         toReturn = this.children[i].getMessage(x);
        //         if (toReturn != null)
        //             break;
        //     }
        // }
        // return toReturn;
    }

    getId()
    {
        // return this._id;
    }
}

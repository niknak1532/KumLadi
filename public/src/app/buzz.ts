import {User} from './user/user';

export class Buzz{
    public BuzzUsers: Array<User>;

    constructor() {
        this.BuzzUsers = [];
    }

    public addUserBuzz(uID: string, ini: string, name: string, surname: string, email: string, cell: string, modules: string, pseodoname: string, title: string){
        console.log("User Added: " + uID);
        this.BuzzUsers.concat(new User(uID, ini, name, surname, email, cell, modules, pseodoname, title));
    }

    public validateME(uID: string){
        for(let V = 0; V < this.BuzzUsers.length; V++){
            console.log("ValidateME: " + uID + " -- " + this.BuzzUsers[V].surname);
            if(uID == this.BuzzUsers[V].userID){
                console.log("ValidateME MATCHED!!: " + uID + " -- " + this.BuzzUsers[V].surname);
                return true;
            }
        }

        console.log("OUT: " + uID);
        return false;
    }

    public identify(user: string){

    }
}

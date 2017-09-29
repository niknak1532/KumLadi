/**
 * Created by nkosinathi on 2017/08/05.
 */

export class User
{
    public userID: string;
    public initials: string;
    public name: string;
    public surname: string;
    public email: string;
    public cell: string;
    public modules: string;
    public pseodoname: string;
    public title: string;


    constructor(userID: string, initials: string, name: string, surname: string, email: string, cell: string, modules: string, pseodoname: string, title: string) {
        this.userID = userID;
        this.initials = initials;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.cell = cell;
        this.modules = modules;
        this.pseodoname = pseodoname;
        this.title = title;
    }

    public startUP(user: string){

    }
}

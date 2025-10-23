/* eslint-disable prettier/prettier */

export class UserDTO {

    private _id: number;
    private _email: string;
    private _password: string;
    private _roleName: string;

    constructor(email: string, password: string, roleName: string) {
        this.email = email;
        this.password = password;
        this.roleName = roleName;
    }

    
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }
    public get roleName(): string {
        return this._roleName;
    }
    public set roleName(value: string) {
        this._roleName = value;
    }
}

/* eslint-disable prettier/prettier */

// prettier-ignore
export class UserDTO {

    private _id: number;
    private _email: string;
    private _password: string;
    private _privileges: string[] = [];

    constructor(email: string, password: string, privileges: string[]) {
        this.email = email;
        this.password = password;
        this.privileges = privileges;
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
    public get privileges(): string[] {
        return this._privileges;
    }
    public set privileges(value: string[]) {
        this._privileges = value;
    }
}

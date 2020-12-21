import { Role } from '../main-home/Users/Roles.Model';

export interface User {
    UserID: string;
    UserName: string;
    Password: string;
    Cashier: boolean;
    Inactive: boolean;
    RolesDto:Array<Role>;
}

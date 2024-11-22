import {IsNotEmpty, IsString, IsEnum, IsOptional, MinLength, MaxLength} from "class-validator";


export enum Role{
    ADMIN = "ADMIN",
    USER = "USER"
}

export class CreateUserDTO{
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username:string;

    @IsNotEmpty()
    @IsString()
    password:string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    constructor(username: string, password: string, role?: Role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}
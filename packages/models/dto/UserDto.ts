class UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}
class LoginRequestDto {
    public username: string;
    public password: string;
    public rememberMe?: boolean;
    public recaptchaResponse?: string;
}

class RegisterUserRequestDto {
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
}

class ChangePasswordRequestDto {
    public oldPassword: string;
    public newPassword: string;
    public confirmPassword: string;
}

export { UserDto, LoginRequestDto, ChangePasswordRequestDto, RegisterUserRequestDto };

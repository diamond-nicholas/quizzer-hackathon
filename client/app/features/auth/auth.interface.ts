export interface RegisterReq {
    user: UserProps;
    token: string;
    message: string;
}

export interface SignupProps {
    email: string;
    password: string;
    roles?: string;
    fullName: string;
}

export interface UserProps {
    category: string;
    createdAt: string;
    email: string;
    fullName: string;
    id: string;
    isAccountVerified: boolean;
    mobile: string;
    roles: string;
    updatedAt: string;
    username: string;
}
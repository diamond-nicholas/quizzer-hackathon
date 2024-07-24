import requestNew from "@/app/utils/requestNew";
import { RegisterReq, SignupProps } from "./auth.interface";
import { useMutation } from "@tanstack/react-query";

export const register = (data: SignupProps) => {
    const response = requestNew<RegisterReq>({
        url: '/auth/register',
        method: 'POST',
        data
    });
    return response;
};

export const useRegisterMutation = () => {
    return useMutation<RegisterReq, Error, SignupProps>({
        mutationFn: register,
        onSuccess(data) {
            localStorage.setItem('token', JSON.stringify(data?.token));
        }
    });
};
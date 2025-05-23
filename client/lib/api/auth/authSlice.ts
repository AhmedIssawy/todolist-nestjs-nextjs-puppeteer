import apiSlice from "../apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<any, { email: string; password: string }>({
            query: (credentials) => ({
                url: '/auth/login',
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ['User', 'Auth'],
        }),
        register: builder.mutation<any, { email: string; password: string; fullName: string; linkedInUrl?: string }>({
            query: (userData) => ({
                url: '/auth/register',
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ['User', 'Auth'],
        }),
        logout: builder.mutation<any, void>({
            query: () => ({
                url: '/auth/logout',
                method: "POST",
            }),
            invalidatesTags: ['User', 'Auth'],
        }),

    })
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApiSlice;
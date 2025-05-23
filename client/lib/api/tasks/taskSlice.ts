import { USERS_ENDPOINT } from "../../constants";
import apiSlice from "../apiSlice";


const taskApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => '/user/profile',
            providesTags: ['User'],
        }),
        createTask: builder.mutation({
            query: (task) => ({
                url: `${USERS_ENDPOINT}/add`,
                method: 'POST',
                body: task,
            }),
            extraOptions: {
                refetchOnFocus: true,
                refetchOnReconnect: true,
                refetchOnMountOrArgChange: true,
            },
            invalidatesTags: ['User'],
        }),
        updateTask: builder.mutation({
            query: (task) => ({
                url: `${USERS_ENDPOINT}/update`,
                method: 'POST',
                body: task,
            }),
            extraOptions: {
                refetchOnFocus: true,
                refetchOnReconnect: true,
                refetchOnMountOrArgChange: true,
            },
            invalidatesTags: ['User'],
        }),
        deleteTask: builder.mutation({
            query: (taskData) => ({
                url: `${USERS_ENDPOINT}/delete`,
                method: 'DELETE',
                body: taskData,
            }),
            extraOptions: {
                refetchOnFocus: true,
                refetchOnReconnect: true,
                refetchOnMountOrArgChange: true,
            },
            invalidatesTags: ['User'],
        }),
        markTaskAsDone: builder.mutation({
            query: (task) => ({
                url: `${USERS_ENDPOINT}/mark-completed`,
                method: 'PATCH',
                body: task,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useMarkTaskAsDoneMutation,
} = taskApiSlice;
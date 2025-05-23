"use client";

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/lib/api/tasks/taskSlice";
import { useLogoutMutation } from "@/lib/api/auth/authSlice";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import type { Task } from "@/lib/types";

const Dashboard = () => {
  const {
    user: userProfile,
    isAuthLoading,
    isAuthenticated,
    isError,
    error,
  } = useAuth();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [logout] = useLogoutMutation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const router = useRouter(); // Get unique categories from tasks
  const categories = useMemo(() => {
    if (!userProfile?.taskList) return [];
    const uniqueCategories = [
      ...new Set(userProfile.taskList.map((task: Task) => task.category)),
    ];
    return uniqueCategories.sort();
  }, [userProfile?.taskList]) as string[];

  // Filter tasks based on selected category and completion status
  const filteredTasks = useMemo(() => {
    if (!userProfile?.taskList) return [];

    return userProfile.taskList.filter((task: Task) => {
      const categoryMatch =
        selectedCategory === "all" || task.category === selectedCategory;
      const completionMatch = showCompleted ? true : !task.completed;
      return categoryMatch && completionMatch;
    });
  }, [userProfile?.taskList, selectedCategory, showCompleted]);
  const completedTasksCount =
    userProfile?.taskList?.filter((task: Task) => task.completed).length || 0;
  const totalTasksCount = userProfile?.taskList?.length || 0;
  const overdueTasksCount =
    userProfile?.taskList?.filter(
      (task: Task) =>
        task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
    ).length || 0;
  const completionPercentage =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  // Handlers
  const handleToggleComplete = async (task: Task) => {
    try {
      await updateTask({
        oldTitle: task.title,
        title: task.title,
        description: task.description,
        category: task.category,
        dueDate: task.dueDate,
        completed: !task.completed,
      }).unwrap();

      toast.success(
        `Task marked as ${!task.completed ? "completed" : "pending"}!`
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update task");
    }
  };
  const handleDeleteTask = async (task: Task) => {
    // Open the confirmation modal and set the task to delete
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  // Function to confirm and execute deletion
  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask({ title: taskToDelete.title }).unwrap();
      toast.success("Task deleted successfully!");

      // Close the delete confirmation modal
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete task");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowAddModal(true);
  };
  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    category: string;
    dueDate?: string;
  }) => {
    try {
      await createTask(taskData).unwrap();
      toast.success("Task created successfully!");
      setShowAddModal(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async (taskData: {
    title: string;
    description: string;
    category: string;
    dueDate?: string;
  }) => {
    if (!editingTask) return;

    try {
      await updateTask({
        oldTitle: editingTask.title,
        ...taskData,
        completed: editingTask.completed,
      }).unwrap();

      toast.success("Task updated successfully!");
      setShowAddModal(false);
      setEditingTask(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update task");
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push("/login");
      toast.success("Logged out successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to logout");
    }
  };
  if (isAuthLoading) {
    return <DashboardSkeleton />;
  }

  // If not authenticated, the useAuth hook will handle redirection
  if (!isAuthenticated) {
    return <DashboardSkeleton />;
  }

  if (isError && error) {
    // Check if it's an authentication error
    if ("status" in error && (error.status === 401 || error.status === 403)) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Required
            </h1>
            <p className="text-gray-600 mb-4">
              You need to log in to access this page.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    // Other errors
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Dashboard
          </h1>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {userProfile?.fullName || "User"}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {userProfile?.linkedinHeadline || userProfile?.email}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* LinkedIn Profile */}
              {userProfile?.linkedinFullName && (
                <div className="flex items-center space-x-3 bg-blue-50 px-3 py-2 rounded-lg w-full sm:w-auto">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {userProfile.linkedinFullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900 truncate">
                      {userProfile.linkedinFullName}
                    </p>
                    <p className="text-xs text-blue-700">LinkedIn Connected</p>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex cursor-pointer items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center sm:justify-start"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Tasks
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  {totalTasksCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Completed
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  {completedTasksCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Pending
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  {totalTasksCount - completedTasksCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Progress
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  {completionPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Overall Progress
            </h3>
            <span className="text-sm sm:text-base font-medium text-gray-600">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                Filter by Category
              </h3>{" "}
              <div className="flex flex-wrap gap-2">
                <button
                  key={"all"}
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All ({totalTasksCount})
                </button>{" "}
                {categories.map((category: string) => {
                  const categoryCount =
                    userProfile?.taskList?.filter(
                      (task: Task) => task.category === category
                    ).length || 0;
                  return (
                    <button
                      key={category + Math.random()}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors capitalize ${
                        selectedCategory === category
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {category} ({categoryCount})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Show completed
                </span>
              </label>
            </div>
          </div>
        </div>
        {/* Tasks Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task: Task) => {
              const isOverdue =
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                !task.completed;

              return (
                <div
                  key={task?.title}
                  className={`bg-white rounded-lg shadow-sm border-l-4 p-4 sm:p-6 hover:shadow-md transition-shadow ${
                    task.completed
                      ? "border-green-500 bg-green-50"
                      : isOverdue
                      ? "border-red-500 bg-red-50"
                      : "border-indigo-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          task.category === "studying"
                            ? "bg-blue-100 text-blue-800"
                            : task.category === "gaming"
                            ? "bg-purple-100 text-purple-800"
                            : task.category === "chilling"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task.category}
                      </span>
                    </div>
                    {task.completed && (
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <h4
                    className={`text-base sm:text-lg font-semibold mb-2 ${
                      task.completed
                        ? "text-gray-600 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {task.title}
                  </h4>{" "}
                  <p
                    className={`text-sm mb-2 ${
                      task.completed ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    {task.description}
                  </p>
                  {task.dueDate && (
                    <div className="flex items-center mb-4">
                      <svg
                        className="w-4 h-4 text-gray-400 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span
                        className={`text-xs ${
                          new Date(task.dueDate) < new Date()
                            ? "text-red-600 font-medium"
                            : task.completed
                            ? "text-gray-500"
                            : "text-gray-600"
                        }`}
                      >
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                        {new Date(task.dueDate) < new Date() &&
                          !task.completed &&
                          " (Overdue)"}
                      </span>
                    </div>
                  )}{" "}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-indigo-600 cursor-pointer hover:text-indigo-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task)}
                        className="text-red-600 cursor-pointer hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`px-3 py-1 cursor-pointer rounded-md text-xs font-medium transition-colors ${
                        task.completed
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                    >
                      {task.completed ? "Mark Pending" : "Mark Complete"}
                    </button>{" "}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-600">
                {selectedCategory === "all"
                  ? "You don't have any tasks yet. Create your first task to get started!"
                  : `No tasks found in "${selectedCategory}" category.`}
              </p>
            </div>
          )}
        </div>{" "}
        {/* Add Task Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => {
              setEditingTask(null);
              setShowAddModal(true);
            }}
            className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>{" "}
        {/* Add/Edit Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingTask ? "Edit Task" : "Add New Task"}
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const dueDateValue = formData.get("dueDate") as string;
                    const taskData = {
                      title: formData.get("title") as string,
                      description: formData.get("description") as string,
                      category: formData.get("category") as string,
                      dueDate: dueDateValue || undefined,
                    };

                    if (editingTask) {
                      handleUpdateTask(taskData);
                    } else {
                      handleCreateTask(taskData);
                    }
                  }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={editingTask?.title || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      defaultValue={editingTask?.description || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter task description"
                    />
                  </div>{" "}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      required
                      defaultValue={editingTask?.category || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a category</option>
                      <option value="studying">Studying</option>
                      <option value="gaming">Gaming</option>
                      <option value="chilling">Chilling</option>
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      defaultValue={
                        editingTask?.dueDate
                          ? new Date(editingTask.dueDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingTask(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      {editingTask ? "Update Task" : "Create Task"}
                    </button>
                  </div>{" "}
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">
                  Delete Task
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete this task? This action
                    cannot be undone.
                  </p>
                  <div className="mt-1">
                    <p className="text-sm font-medium text-gray-800 bg-gray-100 p-2 rounded my-2">
                      {taskToDelete?.title}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setTaskToDelete(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteTask}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

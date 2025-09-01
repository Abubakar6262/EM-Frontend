"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Edit, Trash2, Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { authService, UserItem, UserProfileValues } from "@/services/auth";
import UserProfileForm from "@/components/UserProfileCreate";

// Responsive table
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { handleApiError } from "@/lib/utils";
import { notify } from "@/data/global";
import Button from "@/components/ui/Button";

export default function UserManagementPage() {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
    const [selectedRole, setSelectedRole] = useState("PARTICIPANT");

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);

    const fetchUsers = async (page = 1, query = "") => {
        setLoading(true);
        try {
            const res = await authService.getMyUsers(page, 10, query);
            if (res.success) {
                setUsers(res.users);
                setTotalPages(res.totalPages);
                setCurrentPage(res.currentPage);
            } else {
                setUsers([]);
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage, search);
    }, [currentPage, search]);

    // Add user
    const handleAddUser = async (values: UserProfileValues) => {
        try {
            const res = await authService.createUser(values);

            if (res) {
                notify("User created successfully", "success");
                setIsAddUserModalOpen(false);
                fetchUsers();
            }

        } catch (err) {
            handleApiError(err);
            console.error("Error creating user", err);
        }
    };

    // Update role
    const handleUpdateRole = async () => {
        if (!selectedUser) return;
        try {
            await authService.updateRole(selectedUser.id, selectedRole);
            setIsRoleModalOpen(false);
            fetchUsers(currentPage, search);
            notify("User role updated successfully", "success");
        } catch (err) {
            handleApiError(err);
            console.error("Error updating role", err);
        }
    };


    // Delete user
    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await authService.deleteUser(selectedUser.id);
            setIsDeleteModalOpen(false);
            fetchUsers(currentPage, search);
            notify("User deleted successfully", "success");
        } catch (err) {
            console.error("Error deleting user", err);
            handleApiError(err);
        }
    };

    // Handle dropdown open with absolute window positioning
    const handleDropdown = (e: React.MouseEvent, userId: string) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

        setDropdownPos({
            top: rect.bottom + 4 + window.scrollY,
            left: rect.right - 160 + window.scrollX,
        });

        setOpenDropdown(openDropdown === userId ? null : userId);
    };

    return (
        <div className="space-y-6 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full sm:w-1/2 md:w-1/3 p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"

                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto"
                    onClick={() => setIsAddUserModalOpen(true)}
                >
                    <Plus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <Table className="w-full text-sm text-left">
                    <Thead className="bg-muted dark:bg-gray-800">
                        <Tr>
                            <Th className="px-4 py-3">Sr#</Th>
                            <Th className="px-4 py-3">Full Name</Th>
                            <Th className="px-4 py-3">Email</Th>
                            <Th className="px-4 py-3">Role</Th>
                            <Th className="px-4 py-3 text-right">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {loading ? (
                            <Tr>
                                <Td colSpan={5} className="px-4 py-6 text-center">Loading...</Td>
                            </Tr>
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <Tr key={user.id} className="border-t">
                                    <Td className="px-4 py-3">{(currentPage - 1) * 10 + index + 1}</Td>
                                    <Td className="px-4 py-3">{user.fullName}</Td>
                                    <Td className="px-4 py-3 break-words min-w-[200px]">{user.email}</Td>
                                    <Td className="px-4 py-3">{user.role}</Td>
                                    <Td className="px-4 py-3 text-right">
                                        {/* Desktop: dropdown menu */}
                                        <div className="hidden sm:block">
                                            <button
                                                onClick={(e) => handleDropdown(e, user.id)}
                                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Mobile: pill buttons */}
                                        <div className="flex gap-2 flex-wrap justify-start sm:hidden mt-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsRoleModalOpen(true);
                                                }}
                                                className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                                            >
                                                <Edit className="inline w-3 h-3 mr-1" />
                                               Update Role
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="px-3 py-1 text-xs bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                            >
                                                <Trash2 className="inline w-3 h-3 mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan={5} className="px-4 py-6 text-center">No users found.</Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </div>

            {/* Pagination */}
            {users.length > 0 && !loading && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}

            {/* Dropdown rendered outside scroll container */}
            <AnimatePresence>
                {openDropdown && dropdownPos && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        style={{ position: "absolute", top: dropdownPos.top, left: dropdownPos.left }}
                        className="w-40 bg-white dark:bg-gray-900 border rounded-lg shadow-lg z-[9999]"
                    >
                        <button
                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            onClick={() => {
                                const user = users.find((u) => u.id === openDropdown) || null;
                                setSelectedUser(user);
                                setIsRoleModalOpen(true);
                                setOpenDropdown(null);
                            }}
                        >
                            <Edit className="w-4 h-4" /> Update Role
                        </button>
                        <button
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100"
                            onClick={() => {
                                const user = users.find((u) => u.id === openDropdown) || null;
                                setSelectedUser(user);
                                setIsDeleteModalOpen(true);
                                setOpenDropdown(null);
                            }}
                        >
                            <Trash2 className="w-4 h-4" /> Delete User
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add User Modal */}
            <Modal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                title="Add New User"
            >
                <UserProfileForm
                    initialValues={{ fullName: "", email: "", role: "ORGANIZER" }}
                    onSubmit={handleAddUser}
                    submitLabel="Create User"
                />
            </Modal>

            {/* Update Role Modal */}
            <Modal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                title="Update User Role"
            >
                <div className="space-y-4">
                    <select
                        className="w-full p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        <option value="PARTICIPANT">Participant</option>
                        <option value="ORGANIZER">Organizer</option>
                    </select>
                    <button
                        onClick={handleUpdateRole}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Update Role
                    </button>
                </div>
            </Modal>

            {/* Delete User Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete User"
            >
                <div className="space-y-4">
                    <p>Are you sure you want to delete <b>{selectedUser?.fullName}</b>?</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 rounded-lg border"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteUser}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

import { useEffect, useState } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import { allUsers, updateUserRole } from "../api/admin";
import type { ApiError, JWTPayload, UserRole } from "../types/api";
import { USER_ROLES } from "../api/auth";
import { useSnackbar } from "notistack";
import {
  DataGrid,
  getGridDateOperators,
  getGridNumericOperators,
  getGridSingleSelectOperators,
  type GridColDef,
} from "@mui/x-data-grid";
import { CustomToolbar } from "../components/mui-material/toolbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

// Admin page to manage user roles
export default function Admin() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { logout, refreshStatus } = useAuth();
  const [users, setUsers] = useState<JWTPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  // Update user role
  const handleRoleChange = async (userId: number, role: UserRole) => {
    setUpdatingUserId(userId);
    try {
      await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u)),
      );
      enqueueSnackbar("User role successfully updated", { variant: "success" });
    } catch (err) {
      const status = (err as ApiError).response?.status;
      if (status == 403) {
        enqueueSnackbar("Your role is insufficient", { variant: "warning" });
        console.warn("Your role is insufficient: ", err);

        refreshStatus().then(() => navigate("/", { replace: true }));
      } else if (status === 401) {
        enqueueSnackbar("Your session has expired. Please log in again.", {
          variant: "warning",
        });
        console.warn("You don't have a valid JWT auth token: ", err);

        logout().then(() => navigate("/login", { replace: true }));
      } else if (status === 400) {
        enqueueSnackbar(
          "Couldn't update user role due to invalid credentials",
          { variant: "warning" },
        );
        console.warn("Missing ID and/or role, or role is invalid: ", err);
      } else if (status === 404) {
        enqueueSnackbar(
          "Couldn't update user role because the user was not found",
          { variant: "warning" },
        );
        console.warn(
          "Couldn't update user role because the user was not found: ",
          err,
        );
      } else {
        enqueueSnackbar(
          "Couldn't update the user role due to an unexpected error.",
          { variant: "error" },
        );
        console.error(
          "Couldn't update the user role due to an unexpected error: ",
          err,
        );
      }
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Load users at mount
  useEffect(() => {
    setLoading(true);
    allUsers()
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        const status = (err as ApiError).response?.status;
        if (status == 403) {
          enqueueSnackbar("Your role is insufficient", { variant: "warning" });
          console.warn("Your role is insufficient: ", err);

          refreshStatus().then(() => navigate("/", { replace: true }));
        } else if (status === 401) {
          enqueueSnackbar("Your session has expired. Please log in again.", {
            variant: "warning",
          });
          console.warn("You don't have a valid JWT auth token: ", err);

          logout().then(() => navigate("/login", { replace: true }));
        } else {
          enqueueSnackbar("Couldn't fetch users due to an unexpected error.", {
            variant: "error",
          });
          console.error(
            "An unexpected error occurred in allUsers API call: ",
            err,
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading, enqueueSnackbar, logout, navigate, refreshStatus]);

  // Columns for DataGrid table
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      filterOperators: getGridNumericOperators(),
    },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      type: "singleSelect",
      valueOptions: [...USER_ROLES],
      filterOperators: getGridSingleSelectOperators(),
      renderCell: (params) => (
        <Select
          id={`role-select-${params.row.id}`}
          name="role"
          value={params.value}
          size="small"
          onChange={(e) =>
            handleRoleChange(params.row.id, e.target.value as UserRole)
          }
          disabled={updatingUserId === params.row.id}
        >
          {USER_ROLES.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      filterOperators: getGridDateOperators(),
      valueGetter: (params) => new Date(params),
      valueFormatter: (params) => new Date(params).toLocaleString(),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" my={3}>
        User Role Management
      </Typography>

      {/* Users displayed in a modern, feature-rich table for easy role updates and user search */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 20, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 50 },
            },
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
          disableRowSelectionOnClick
          sx={{ border: 0, minWidth: 400 }}
          showToolbar={true}
          slots={{ toolbar: CustomToolbar }}
        />
      </Box>
    </Box>
  );
}

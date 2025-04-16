import { GridColDef } from "@mui/x-data-grid";
import { Employee } from "../../../server/src/entities/Employee";

const createEmployeeTableColumnsDeactivated = (): GridColDef<Employee>[] => [
    {
        field: "fullName", headerName: "Employee", flex: 1, minWidth: 320,
        renderCell: (params) => (
            <>{params.row.salutation} {params.row.title} {params.row.firstName} {params.row.lastName}</>
        ),
    },
    {
        field: "company", headerName: "Works at", flex: 1, minWidth: 320,
        renderCell: (params) => (
            <>{params.row.location.company.name}</>
        ),
    },
];

export default createEmployeeTableColumnsDeactivated;

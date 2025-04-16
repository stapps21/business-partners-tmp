import { GridColDef } from "@mui/x-data-grid";

const createCompanyTableColumnsDeactivated = (): GridColDef[] => [
    { field: "name", headerName: "Company", flex: 1, minWidth: 320, disableColumnMenu: true },
    // {
    //     field: "location", headerName: "Location", width: 150,
    //     renderCell: (params) => params.row.locations[0].name,
    // },
];

export default createCompanyTableColumnsDeactivated;

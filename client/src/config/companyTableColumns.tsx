import LinkIcon from "@mui/icons-material/Link";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import { getFirstContactOfType } from "../utils/companyUtils";
import { GridColDef } from "@mui/x-data-grid";

const createCompanyTableColumns = (): GridColDef[] => [
    { field: "name", headerName: "Name", flex: 1, minWidth: 320, disableColumnMenu: true },
    // {
    //     field: "location", headerName: "Location", width: 150,
    //     renderCell: (params) => params.row.locations[0].name,
    // },
    {
        field: "mail", headerName: "Mail", flex: 1,
        renderCell: (params) => getFirstContactOfType(params.row.contacts, 'mail'),
        disableColumnMenu: true, sortable: false
    },
    {
        field: "phone", headerName: "Phone", flex: 1,
        renderCell: (params) => getFirstContactOfType(params.row.contacts, 'phone'),
        disableColumnMenu: true, sortable: false
    },
    {
        field: "mobile", headerName: "Mobile", flex: 1,
        renderCell: (params) => getFirstContactOfType(params.row.contacts, 'mobile'),
        disableColumnMenu: true, sortable: false
    },
    {
        field: "fax", headerName: "Fax", flex: 1,
        renderCell: (params) => getFirstContactOfType(params.row.contacts, 'fax'),
        disableColumnMenu: true, sortable: false
    },
    // {
    //     field: "industries", headerName: "Industries", flex: 1,
    //     renderCell: (params) => params.row.industries.map((industry: Industry) => industry.name).join(', '),
    //     disableColumnMenu: true, sortable: false
    // },
    {
        field: "website", headerName: "Website", disableColumnMenu: true, sortable: false, minWidth: 180,
        renderCell: (params) => {
            if (!params.row.website || params.row.website === "") return <></>
            return (
                <Tooltip title={params.row.website} sx={{ zIndex: 3 }}>
                    <Chip
                        size="small"
                        label="Open Website"
                        color="primary"
                        variant="outlined"
                        onClick={(event) => {
                            event.stopPropagation()
                            window.open(params.row.website, '_blank')
                        }}
                        icon={<LinkIcon />}
                    />
                </Tooltip>
            );
        },
    },
    // {
    //     field: "actions", headerName: "Actions", width: 100,
    //     renderCell: () => (
    //         <IconButton>
    //             <MoreVert />
    //         </IconButton>
    //     ),
    //     disableColumnMenu: true, sortable: false, filterable: false
    // }
];

export default createCompanyTableColumns;

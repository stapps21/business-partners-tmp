import { GridColDef } from "@mui/x-data-grid";
import { Company } from "../../../server/src/entities/Company";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { getFirstContactOfType } from "../utils/companyUtils";


const formatCompanyInfo = (company: Company) => {
    if (!company) return '';
    return `${company.name}`;
};

const createEmployeeTableColumns = (): GridColDef[] => [
    {
        field: "fullName", headerName: "Employee", flex: 1, maxWidth: 260,
        renderCell: (params) => {
            return (
                <Box display="flex" flexDirection="column">
                    <Typography fontSize={14} lineHeight={1.1} color={'secondary'} >
                        {params.row.salutation} {params.row.title}
                    </Typography>
                    <Typography lineHeight={1.1}>
                        {params.row.firstName} {params.row.lastName}
                    </Typography>
                </Box>)
        }
    },
    {
        field: "companyInfo", headerName: "Works at", flex: 1,
        renderCell: (params) => {
            return (
                <Box display="flex" flexDirection="column">
                    <Typography lineHeight={1.1}>
                        {formatCompanyInfo(params.row.location.company)}
                    </Typography>
                    <Typography fontSize={14} lineHeight={1.1} color={grey[400]}>
                        {params.row.location.name}
                        {/* {formatAddress(params..location)} */}
                    </Typography>
                </Box>)
        }
    },

    // {
    //     field: "active", headerName: "Active", width: 100,
    //     renderCell: (params) => (params.row.active ? "Yes" : "No"),
    // },
    // {
    //     field: "address", headerName: "Address", flex: 1,
    //     renderCell: (params) => formatAddress(params.row.location),
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
    // {
    //     field: "jobTitles", headerName: "Job Titles", flex: 1,
    //     renderCell: (params) => params.row.jobTitles.map((job: JobTitle) => job.name).join(', '),
    // },
    // {
    //     // Combine all contacts into a single column for efficiency
    //     field: "contacts", headerName: "Contacts", flex: 1,
    //     renderCell: (params) => [
    //         getFirstContactOfType(params.row.contacts, 'mail'),
    //         getFirstContactOfType(params.row.contacts, 'phone'),
    //         getFirstContactOfType(params.row.contacts, 'mobile'),
    //         getFirstContactOfType(params.row.contacts, 'fax')
    //     ].filter(contact => contact).join(' | '),
    // },
    // {
    //     field: "subjects", headerName: "Subjects", flex: 1,
    //     renderCell: (params) => params.row.subjects.map((subject: Subject) => subject.name).join(', '),
    // },
    // {
    //     field: "createdAt", headerName: "Created At", width: 150,
    //     renderCell: (params) => formatDate(params.row.createdAt),
    // },
    // {
    //     field: "actions", headerName: "Actions", width: 100,
    //     renderCell: () => (
    //         <IconButton>
    //             <MoreVert />
    //         </IconButton>
    //     ),
    // }
];

export default createEmployeeTableColumns;

import {
    Box,
    Grid,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import DialogCreateIndustry from '../../components/dialogs/DialogCreateIndustry';
import DialogCreateJobTitle from '../../components/dialogs/DialogCreateJobTitle';
import DialogCreateSubject from '../../components/dialogs/DialogCreateSubject';
import { useFetchData } from '../../hooks/api/useFetchData';
import DialogEditReferenceData from '../../components/dialogs/DialogEditReferenceData';
import DialogDeleteReferenceData from '../../components/dialogs/DialogDeleteReferenceData';
import { ReactNode } from 'react';
import { Industry } from '../../../../server/src/entities/company/Industry';
import { JobTitle } from '../../../../server/src/entities/employee/JobTitle';
import { Subject } from '../../../../server/src/entities/employee/Subject';
import { ActionIcons, ActionTableCell } from '../../components/table-cell/ActionTableCell';

type ReferenceDataType = 'industry' | 'subject' | 'jobtitle'

interface DataItem {
    id: number,
    name: string
}

interface DataRowProps {
    referenceDataType: ReferenceDataType,
    item: DataItem
}

const DataRow = ({ referenceDataType, item }: DataRowProps) => {
    // Function to render action icons based on reference data type
    const renderActionIcons = (type: ReferenceDataType, routePrefix: string, queryKey: string) => (
        <>
            <DialogEditReferenceData type={type} route={`/${routePrefix}/${item.id}`} queryKey={queryKey} initialData={item} />
            <DialogDeleteReferenceData route={`/${routePrefix}`} queryKey={queryKey} initialData={item} />
        </>
    );
    // Mapping object for reference data types
    const referenceDataTypes = {
        industry: { type: 'industry', routePrefix: 'industries', queryKey: 'industries' },
        subject: { type: 'subject', routePrefix: 'subjects', queryKey: 'subjects' },
        jobtitle: { type: 'jobtitle', routePrefix: 'job-titles', queryKey: 'jobTitles' },
    };

    // Get the current reference data type properties
    const currentType = referenceDataTypes[referenceDataType];

    return (
        <TableRow hover sx={{ '&:hover .action-icons': { visibility: 'visible' } }}>
            <TableCell>{item.name}</TableCell>
            <ActionTableCell>
                <ActionIcons className="action-icons">
                    {currentType && renderActionIcons(currentType.type as ReferenceDataType, currentType.routePrefix, currentType.queryKey)}
                </ActionIcons>
            </ActionTableCell>
        </TableRow>
    );
};


interface TableProps {
    referenceDataType: ReferenceDataType,
    data: DataItem[],
    title: string,
    addDialog: ReactNode
}

const CustomTable = ({ referenceDataType, data, title, addDialog }: TableProps) => (
    <Box mb="40px">
        <TableContainer component={Paper} sx={{ mb: 1 }}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>{title}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => <DataRow referenceDataType={referenceDataType} key={index} item={item} />)}
                </TableBody>
            </Table>
        </TableContainer>
        {addDialog}
    </Box>
);

const ReferenceDataPage = () => {
    const { data: industries } = useFetchData<Industry[]>('/industries', 'industries')
    const { data: jobTitles } = useFetchData<JobTitle[]>('/job-titles', 'jobTitles')
    const { data: subjects } = useFetchData<Subject[]>('/subjects', 'subjects')

    return (
        <>
            <Box m="20px">
                <Typography variant="h4" gutterBottom>For employees</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <CustomTable referenceDataType="jobtitle" data={jobTitles ?? []} title="Job Title" addDialog={<DialogCreateJobTitle />} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <CustomTable referenceDataType="subject" data={subjects ?? []} title="Subject" addDialog={<DialogCreateSubject />} />
                    </Grid>
                </Grid>

                <Typography variant="h4" gutterBottom>For companies</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <CustomTable referenceDataType="industry" data={industries ?? []} title="Industry" addDialog={<DialogCreateIndustry />} />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};


export default ReferenceDataPage;

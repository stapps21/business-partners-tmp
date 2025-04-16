import React from 'react';
import { create, Delta } from 'jsondiffpatch';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip
} from '@mui/material';

interface JsonDiffViewProps {
    previousJson: Record<string, any> | null;
    afterJson: Record<string, any> | null;
}

const JsonDiffView: React.FC<JsonDiffViewProps> = ({ previousJson, afterJson }) => {
    if (!previousJson && !afterJson) {
        return <Typography>No data available</Typography>;
    }

    if (!previousJson) {
        return (
            <Paper style={{ padding: '10px' }}>
                <Typography variant="h6">Newly Created Object</Typography>
                <Typography>{JSON.stringify(afterJson, null, 2)}</Typography>
            </Paper>
        );
    }

    if (!afterJson) {
        return (
            <Paper style={{ padding: '10px' }}>
                <Typography variant="h6">Deleted Object</Typography>
                <Typography>{JSON.stringify(previousJson, null, 2)}</Typography>
            </Paper>
        );
    }

    const jsondiffpatchInstance = create({
        objectHash: (obj, index) => (obj as any)._id || (obj as any).id || `$$index:${index}`,
        arrays: {
            detectMove: true,
            includeValueOnMove: false
        },
        propertyFilter: (name, context) =>
            !(context.leftType === 'array' && context.rightType === 'array'),
        cloneDiffValues: true,
    });

    const delta: Delta | undefined = jsondiffpatchInstance.diff(previousJson, afterJson);

    if (!delta) {
        return <Typography>No differences found</Typography>;
    }

    const getChangeTypeChip = (changeType: string) => {
        let color: "primary" | "secondary" | "success" | "error" = "primary";
        if (changeType === 'ADDED') color = "success";
        else if (changeType === 'REMOVED') color = "error";

        return <Chip label={changeType} color={color} size="small" />;
    };

    const renderArrayChanges = (key: string, value: any, parentIndex: number) => {
        return Object.entries(value).map(([index, change], childIndex) => {
            if (index === '_t') return null; // Skip the _t property

            let changeType = 'UPDATED';
            let oldValue = change[0];
            let newValue = change[1];

            if (typeof oldValue === 'undefined') {
                changeType = 'ADDED';
                oldValue = '';
            } else if (typeof newValue === 'undefined') {
                changeType = 'REMOVED';
                newValue = '';
            }

            return (
                <TableRow key={`${parentIndex}-${childIndex}`}>
                    <TableCell>{`${key}[${index}]`}</TableCell>
                    <TableCell>{oldValue ? JSON.stringify(oldValue) : '—'}</TableCell>
                    <TableCell>{getChangeTypeChip(changeType)}</TableCell>
                    <TableCell>{newValue ? JSON.stringify(newValue) : '—'}</TableCell>
                </TableRow>
            );
        });
    };

    const renderDiffTable = (delta: Delta) => {
        const entries = Object.entries(delta);
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Key</TableCell>
                            <TableCell>Old Value</TableCell>
                            <TableCell>Change Type</TableCell>
                            <TableCell>New Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entries.map(([key, value], index) => {
                            // Handle array changes
                            if (value && '_t' in value && value._t === 'a') {
                                return renderArrayChanges(key, value, index);
                            }

                            let changeType = 'UPDATED';
                            let oldValue = value && value[0];
                            let newValue = value && value[1];

                            if (value && (
                                typeof value[0] === 'undefined' ||
                                value[0] === null)) {
                                changeType = 'ADDED';
                                oldValue = '';
                            } else if (value && (
                                typeof value[1] === 'undefined' ||
                                value[1] === null)) {
                                changeType = 'REMOVED';
                                newValue = '';
                            }

                            return (
                                <TableRow key={index}>
                                    <TableCell>{key}</TableCell>
                                    <TableCell>{oldValue ? JSON.stringify(oldValue) : '—'}</TableCell>
                                    <TableCell>{getChangeTypeChip(changeType)}</TableCell>
                                    <TableCell>{newValue ? JSON.stringify(newValue) : '—'}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return renderDiffTable(delta);
};

export default JsonDiffView;

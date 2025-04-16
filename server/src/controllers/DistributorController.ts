require('module-alias/register')
import { createDistributorService, findDistributorEmployeesPaginatedService, findDistributorEmployeesService, findDistributorsPaginatedService, getDistributorByIdService } from '@/services/DistributorService';
import ResponseError from '@/utils/ResponseError';
import { NextFunction, Request, Response } from 'express';
import PDFDocument from 'pdfkit';

/*********************************************
 * CREATE
 *********************************************/

export const createDistributor = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const distributor = await createDistributorService(req.body);
        return res.status(201).json(distributor);
    } catch (error) {
        // console.error(error)
        // if (error instanceof ResponseError) {
        next(error);
        // } else {
        //     next(new ResponseError(500, "An unexpected error occurred", "UNEXPECTED_ERROR", true));
        // }
    }
}

/*********************************************
 * READ
 *********************************************/

export const getCDistributor = async (req: Request, res: Response) => {
    return res.status(501)
}

export const getAllDistributors = async (req: Request, res: Response): Promise<Response> => {
    return res.status(501)
}

export const getDistributorById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const distributor = await getDistributorByIdService(parseInt(req.params.distributorId));
        if (!distributor) {
            next(new ResponseError(404, "Distributor not found", "IND_404_NOT_FOUND", true));
            return
        }
        return res.json(distributor);
    } catch (error) {
        next(error);
    }
};

export const getDistributorPdf = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const distributor = await getDistributorByIdService(parseInt(req.params.distributorId));
        if (!distributor) {
            next(new ResponseError(404, "Distributor not found", "IND_404_NOT_FOUND", true));
            return;
        }
        const employees = await findDistributorEmployeesService(parseInt(req.params.distributorId));
        if (!employees) {
            next(new ResponseError(404, "Employees not found", "IND_404_NOT_FOUND", true));
            return;
        }

        const doc = new PDFDocument();
        let buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(pdfData),
                'Content-Type': 'application/pdf',
                'Content-disposition': 'attachment;filename=distributor_addresses.pdf',
            });
            res.end(pdfData);
        });

        // Define box and page dimensions
        const mmToPt = (mm) => {
            return mm * (72 / 25.4);
        };

        const BOX_WIDTH_MM = 63//90;
        const BOX_HEIGHT_MM = 38//45;
        const PAGE_WIDTH_MM = 210;
        const PAGE_HEIGHT_MM = 297;
        const MARGIN_MM = 7;
        const SPACING_MM = 1;

        // Convert measurements from mm to points
        const BOX_WIDTH = mmToPt(BOX_WIDTH_MM);
        const BOX_HEIGHT = mmToPt(BOX_HEIGHT_MM);
        const PAGE_WIDTH = mmToPt(PAGE_WIDTH_MM);
        const PAGE_HEIGHT = mmToPt(PAGE_HEIGHT_MM);
        const MARGIN = mmToPt(MARGIN_MM);
        const SPACING = mmToPt(SPACING_MM);

        // Calculate number of boxes per row and column
        const boxesPerRow = Math.floor((PAGE_WIDTH - MARGIN * 2) / (BOX_WIDTH + SPACING));
        const boxesPerColumn = Math.floor((PAGE_HEIGHT - MARGIN * 2) / (BOX_HEIGHT + SPACING));

        const printEmployeeDetails = (employee, x, y) => {
            const padding = 5; // Padding inside the box
            const lineHeight = 12; // Space between lines

            // Optional: Set a standard font and size
            doc.font('Helvetica').fontSize(8);

            let currentY = y + padding;

            // Print company name
            doc.text(employee.location.company.name, x + padding, currentY);
            currentY += lineHeight;

            // Print employee name
            doc.text(`${employee.salutation} ${employee.firstName} ${employee.lastName}`, x + padding, currentY);
            currentY += lineHeight;

            // Print street address
            doc.text(`${employee.location.street} ${employee.location.houseNumber}`, x + padding, currentY);
            currentY += lineHeight;

            // Print city and postal code
            doc.text(`${employee.location.postalCode} ${employee.location.city}`, x + padding, currentY);
        };


        let employeeIndex = 0;
        while (employeeIndex < employees.length) {
            for (let row = 0; row < boxesPerColumn && employeeIndex < employees.length; row++) {
                for (let col = 0; col < boxesPerRow && employeeIndex < employees.length; col++) {
                    let xPosition = MARGIN + col * (BOX_WIDTH + SPACING);
                    let yPosition = MARGIN + row * (BOX_HEIGHT + SPACING);
                    doc.rect(xPosition, yPosition, BOX_WIDTH, BOX_HEIGHT).stroke();
                    printEmployeeDetails(employees[employeeIndex], xPosition, yPosition);
                    employeeIndex++;
                }
            }

            // Add a new page if there are more employees to print
            if (employeeIndex < employees.length) {
                doc.addPage();
            }
        }

        // Finalize the PDF file
        doc.end();

    } catch (error) {
        next(error);
    }
};

export const getDistributorMail = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const distributor = await getDistributorByIdService(parseInt(req.params.distributorId));
        if (!distributor) {
            next(new ResponseError(404, "Distributor not found", "IND_404_NOT_FOUND", true));
            return;
        }
        const employees = await findDistributorEmployeesService(parseInt(req.params.distributorId));
        if (!employees) {
            next(new ResponseError(404, "Employees not found", "IND_404_NOT_FOUND", true));
            return;
        }

        const mails = employees.map(employee => employee.contacts.find(contact => contact.type === 'mail').value).join(',')
        console.log("MAILS", mails)

        res.status(200).json({ mails })
    } catch (error) {
        next(error);
    }
};


export const findDistributorsPaginated = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const sortBy = req.query.sortBy as string || 'name';
        const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' || 'ASC';

        const [distributors, total] = await findDistributorsPaginatedService({
            page,
            limit,
            search,
            sortBy,
            sortOrder
        });

        return res.status(200).json({
            data: distributors,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const findDistributorEmployeesPaginated = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const sortBy = req.query.sortBy as string || 'name';
        const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' || 'ASC';

        const [distributors, total] = await findDistributorEmployeesPaginatedService(parseInt(req.params.distributorId), {
            page,
            limit,
            search,
            sortBy,
            sortOrder
        });

        return res.status(200).json({
            data: distributors,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/*********************************************
 * UPDATE
 *********************************************/

export const updateDistributor = async (req: Request, res: Response) => {
    return res.status(501)
}

/*********************************************
 * DELETE
 *********************************************/

export const deleteDistributor = async (req: Request, res: Response) => {
    return res.status(501)
}
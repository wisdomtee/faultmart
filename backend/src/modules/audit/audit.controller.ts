import { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler";
import { successResponse } from "../../helpers/response";

import auditService from "./audit.service";


class AuditController {


getLogs = asyncHandler(
async(req:Request,res:Response)=>{


const logs =
 await auditService.getLogs(

   Number(req.query.page) || 1,

   Number(req.query.limit) || 20

 );


return successResponse(
 res,
 logs,
 "Audit logs retrieved successfully."
);


});



}


export default new AuditController();
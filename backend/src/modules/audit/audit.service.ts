import { prisma } from "../../config/prisma";
import { AuditAction } from "@prisma/client";


class AuditService {


  async createLog(
    userId:string,
    action:AuditAction,
    entity:string,
    entityId:string,
    description:string,
    metadata?:any
  ){

    return prisma.auditLog.create({

      data:{
        userId,
        action,
        entity,
        entityId,
        description,
        metadata
      }

    });

  }




  async getLogs(
    page = 1,
    limit = 20
  ){

    const skip = (page - 1) * limit;


    const [
      logs,
      total
    ] = await Promise.all([


      prisma.auditLog.findMany({

        skip,

        take:limit,


        include:{

          user:{
            select: {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
}
          }

        },


        orderBy:{
          createdAt:"desc"
        }

      }),



      prisma.auditLog.count()


    ]);



    return {

      data:logs,

      pagination:{

        page,

        limit,

        total,

        pages:Math.ceil(total / limit)

      }

    };

  }


}


export default new AuditService();
import prisma from "../../config/prisma";
import { UserStatus, ListingStatus, ReportStatus } from "@prisma/client";
import {
  UserStatus,
  ListingStatus,
  ReportStatus,
  OrderStatus
} from "@prisma/client";


class AdminService {


  async getDashboard() {

 const [
  totalUsers,
  activeUsers,
  totalListings,
  activeListings,
  pendingListings,
  totalOrders,
  deliveredOrders,
  revenue,
  recentActivities,
] = await Promise.all([


  prisma.user.count(),


  prisma.user.count({
    where:{
  status: UserStatus.ACTIVE
}
  }),


  prisma.listing.count(),


  prisma.listing.count({
    where:{
  status: UserStatus.ACTIVE
}
  }),


  prisma.listing.count({
    where:{
      status:"PENDING"
    }
  }),


  prisma.order.count(),


  prisma.order.count({
    where:{
      status: OrderStatus.DELIVERED
    }
  }),


  prisma.order.aggregate({

    _sum:{
      amount:true
    },

    where:{
      status: OrderStatus.DELIVERED
    }

  }),


  prisma.auditLog.findMany({

    take:10,

    orderBy:{
      createdAt:"desc"
    },

    include:{
      user:{
        select:{
          id:true,
          name:true,
          email:true
        }
      }
    }

  })

]);


  return {

  users:{
    total: totalUsers,
    active: activeUsers
  },


  listings:{
    total: totalListings,
    active: activeListings,
    pending: pendingListings
  },


  orders:{
    total: totalOrders,
    completed: deliveredOrders
  },


  revenue:
    Number(revenue._sum.amount ?? 0),


  recentActivities

};
  }


  async getUsers(
  page = 1,
  limit = 20,
  search?: string,
  status?: UserStatus
){

  const skip = (page - 1) * limit;


  const where:any = {};


  if(search){

    where.OR = [
      {
        name:{
          contains: search,
          mode:"insensitive"
        }
      },
      {
        email:{
          contains: search,
          mode:"insensitive"
        }
      }
    ];

  }


  if(status){

    where.status = status;

  }



  const [
    users,
    total
  ] = await Promise.all([


    prisma.user.findMany({

      where,

      skip,

      take:limit,

      select:{
        id:true,
        name:true,
        email:true,
        role:true,
        status:true,
        createdAt:true
      },

      orderBy:{
        createdAt:"desc"
      }

    }),


    prisma.user.count({
      where
    })


  ]);



  return {

    data: users,

    pagination:{
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }

  };

}


  async updateUserStatus(
    userId:string,
    status:UserStatus
  ){

    return prisma.user.update({

      where:{
        id:userId
      },

      data:{
        status
      }

    });

  }




  async getListings(
  page = 1,
  limit = 20,
  search?: string,
  status?: ListingStatus
){

  const skip = (page - 1) * limit;


  const where:any = {};


  if(search){

    where.title = {
      contains: search,
      mode:"insensitive"
    };

  }


  if(status){

    where.status = status;

  }



  const [
    listings,
    total
  ] = await Promise.all([


    prisma.listing.findMany({

      where,

      skip,

      take:limit,


      include:{

        seller:{
          select:{
            id:true,
            name:true,
            email:true
          }
        },


        images:true

      },


      orderBy:{
        createdAt:"desc"
      }

    }),


    prisma.listing.count({
      where
    })


  ]);



  return {

    data:listings,

    pagination:{

      page,

      limit,

      total,

      pages:Math.ceil(total / limit)

    }

  };

}



  async updateListingStatus(
    listingId:string,
    status:ListingStatus
  ){

    return prisma.listing.update({

      where:{
        id:listingId
      },

      data:{
        status
      }

    });

  }




  async getReports(
  page = 1,
  limit = 20,
  status?: ReportStatus
){

  const skip = (page - 1) * limit;


  const where:any = {};


  if(status){

    where.status = status;

  }



  const [
    reports,
    total
  ] = await Promise.all([


    prisma.report.findMany({

      where,

      skip,

      take:limit,


      include:{

        reporter:{
          select:{
            id:true,
            name:true,
            email:true
          }
        },


        listing:{
          select:{
            id:true,
            title:true
          }
        }

      },


      orderBy:{
        createdAt:"desc"
      }

    }),



    prisma.report.count({
      where
    })


  ]);



  return {

    data: reports,

    pagination:{

      page,

      limit,

      total,

      pages:Math.ceil(total / limit)

    }

  };

}



  async updateReportStatus(
    reportId:string,
    status:ReportStatus
  ){

    return prisma.report.update({

      where:{
        id:reportId
      },

      data:{
        status
      }

    });

  }


}


export default new AdminService();
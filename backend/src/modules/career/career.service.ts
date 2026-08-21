import { prisma } from "../../config/prisma";
import {
  ApplicationStatus,
  EmploymentType,
  JobStatus,
  Prisma,
} from "@prisma/client";

class CareerService {
  /**
   * ============================================================
   * PUBLIC JOBS
   * ============================================================
   */

  async getJobs(params?: {
    search?: string;
    department?: string;
    employmentType?: EmploymentType;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(params?.page ?? 1, 1);
    const limit = Math.min(Math.max(params?.limit ?? 10, 1), 50);
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {
      status: JobStatus.OPEN,
    };

    if (params?.search) {
      where.OR = [
        {
          title: {
            contains: params.search,
            mode: "insensitive",
          },
        },
        {
          department: {
            contains: params.search,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: params.search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (params?.department) {
      where.department = {
        equals: params.department,
        mode: "insensitive",
      };
    }

    if (params?.employmentType) {
      where.employmentType = params.employmentType;
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.job.count({
        where,
      }),
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * ============================================================
   * GET SINGLE JOB
   * ============================================================
   */

  async getJobBySlug(slug: string) {
    const job = await prisma.job.findFirst({
      where: {
        slug,
        status: JobStatus.OPEN,
      },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    return job;
  }

  /**
   * ============================================================
   * APPLY FOR JOB
   * ============================================================
   */

  async applyForJob(
    jobId: string,
    userId: string,
    data: {
      cvUrl: string;
      coverLetter?: string;
    }
  ) {
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        status: JobStatus.OPEN,
      },
    });

    if (!job) {
      throw new Error("Job not found or no longer accepting applications");
    }

    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId,
        },
      },
    });

    if (existingApplication) {
      throw new Error("You have already applied for this position");
    }

    return prisma.jobApplication.create({
      data: {
        jobId,
        userId,
        cvUrl: data.cvUrl,
        coverLetter: data.coverLetter,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }

  /**
   * ============================================================
   * ADMIN — CREATE JOB
   * ============================================================
   */

  async createJob(data: {
    title: string;
    slug: string;
    department: string;
    location: string;
    employmentType: EmploymentType;
    description: string;
    responsibilities: string;
    requirements: string;
    salaryRange?: string;
    status?: JobStatus;
  }) {
    const existingJob = await prisma.job.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingJob) {
      throw new Error("A job with this slug already exists");
    }

    return prisma.job.create({
      data: {
        title: data.title,
        slug: data.slug,
        department: data.department,
        location: data.location,
        employmentType: data.employmentType,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        salaryRange: data.salaryRange,
        status: data.status ?? JobStatus.DRAFT,
      },
    });
  }

  /**
   * ============================================================
   * ADMIN — GET ALL JOBS
   * ============================================================
   */

  async getAllJobs() {
    return prisma.job.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });
  }

  /**
   * ============================================================
   * ADMIN — UPDATE JOB
   * ============================================================
   */

  async updateJob(
    jobId: string,
    data: Partial<{
      title: string;
      slug: string;
      department: string;
      location: string;
      employmentType: EmploymentType;
      description: string;
      responsibilities: string;
      requirements: string;
      salaryRange: string | null;
      status: JobStatus;
    }>
  ) {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    if (data.slug && data.slug !== job.slug) {
      const existingSlug = await prisma.job.findUnique({
        where: {
          slug: data.slug,
        },
      });

      if (existingSlug) {
        throw new Error("A job with this slug already exists");
      }
    }

    return prisma.job.update({
      where: {
        id: jobId,
      },
      data,
    });
  }

  /**
   * ============================================================
   * ADMIN — DELETE JOB
   * ============================================================
   */

  async deleteJob(jobId: string) {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    return prisma.job.delete({
      where: {
        id: jobId,
      },
    });
  }

  /**
   * ============================================================
   * ADMIN — GET APPLICATIONS
   * ============================================================
   */

  async getApplications(params?: {
    status?: ApplicationStatus;
    jobId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(params?.page ?? 1, 1);
    const limit = Math.min(Math.max(params?.limit ?? 20, 1), 100);
    const skip = (page - 1) * limit;

    const where: Prisma.JobApplicationWhereInput = {};

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.jobId) {
      where.jobId = params.jobId;
    }

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              profileImage: true,
            },
          },
        },
      }),

      prisma.jobApplication.count({
        where,
      }),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * ============================================================
   * ADMIN — GET APPLICATION
   * ============================================================
   */

  async getApplicationById(applicationId: string) {
    const application = await prisma.jobApplication.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        job: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            profileImage: true,
          },
        },
      },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    return application;
  }

  /**
   * ============================================================
   * ADMIN — UPDATE APPLICATION STATUS
   * ============================================================
   */

  async updateApplicationStatus(
    applicationId: string,
    data: {
      status: ApplicationStatus;
      adminNotes?: string;
    }
  ) {
    const application = await prisma.jobApplication.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    return prisma.jobApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: data.status,
        ...(data.adminNotes !== undefined
          ? { adminNotes: data.adminNotes }
          : {}),
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }
}

export default new CareerService();
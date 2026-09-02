import { Request, Response } from "express";
import careerService from "./career.service";

class CareerController {
  /**
   * ============================================================
   * PUBLIC — GET JOBS
   * ============================================================
   */

  async getJobs(req: Request, res: Response) {
    try {
      const result = await careerService.getJobs({
        search: req.query.search as string | undefined,
        department: req.query.department as string | undefined,
        employmentType: req.query.employmentType as any,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch jobs",
      });
    }
  }

  /**
   * ============================================================
   * PUBLIC — GET JOB
   * ============================================================
   */

  async getJobBySlug(req: Request, res: Response) {
    try {
      const job = await careerService.getJobBySlug(String(req.params.slug));

      return res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Job not found",
      });
    }
  }

  /**
   * ============================================================
   * AUTHENTICATED — APPLY
   * ============================================================
   */

  async applyForJob(req: Request, res: Response) {
    try {
      if (!req.user?.userId) {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
}

const application = await careerService.applyForJob(
  String(req.params.id),
  req.user.userId,
  req.body
);

      return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: application,
      });
    } catch (error: any) {
      const message = error.message || "Failed to submit application";

      if (
        message.includes("already applied") ||
        message.includes("no longer accepting")
      ) {
        return res.status(400).json({
          success: false,
          message,
        });
      }

      return res.status(500).json({
        success: false,
        message,
      });
    }
  }

  /**
   * ============================================================
   * ADMIN — CREATE JOB
   * ============================================================
   */

  async createJob(req: Request, res: Response) {
    try {
      const job = await careerService.createJob(req.body);

      return res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: job,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create job",
      });
    }
  }

  /**
   * ============================================================
   * ADMIN — GET JOBS
   * ============================================================
   */

  async getAllJobs(req: Request, res: Response) {
    try {
      const jobs = await careerService.getAllJobs();

      return res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch jobs",
      });
    }
  }

  /**
   * ============================================================
   * ADMIN — UPDATE JOB
   * ============================================================
   */

  async updateJob(req: Request, res: Response) {
    try {
      const job = await careerService.updateJob(
        String(req.params.id),
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Job updated successfully",
        data: job,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update job",
      });
    }
  }

  /**
   * ============================================================
   * ADMIN — DELETE JOB
   * ============================================================
   */

  async deleteJob(req: Request, res: Response) {
    try {
      await careerService.deleteJob(String(req.params.id));

      return res.status(200).json({
        success: true,
        message: "Job deleted successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete job",
      });
    }
  }

  /**
   * ============================================================
   * ADMIN — GET APPLICATIONS
   * ============================================================
   */

  async getApplications(req: Request, res: Response) {
    try {
      const result = await careerService.getApplications({
        status: req.query.status as any,
        jobId: req.query.jobId as string | undefined,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch applications",
      });
    }
  }

  /**
   * ============================================================
   * ADMIN — GET APPLICATION
   * ============================================================
   */

  async getApplicationById(req: Request, res: Response) {
    try {
      const application =
        await careerService.getApplicationById(String(req.params.id));

      return res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Application not found",
      });
    }
  }

  /**
   * ============================================================
   * ADMIN — UPDATE APPLICATION
   * ============================================================
   */

  async updateApplicationStatus(req: Request, res: Response) {
    try {
      const application =
  await careerService.updateApplicationStatus(
    String(req.params.id),
    req.body
  );

      return res.status(200).json({
        success: true,
        message: "Application updated successfully",
        data: application,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update application",
      });
    }
  }
}

export default new CareerController();
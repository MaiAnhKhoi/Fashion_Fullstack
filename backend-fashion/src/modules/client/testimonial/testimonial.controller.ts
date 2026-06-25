import { Request, Response } from "express";
import { handleGetTestimonials } from "./testimonial.service";

const getTestimonials = async (_req: Request, res: Response) => {
  try {
    const testimonials = await handleGetTestimonials();
    return res.status(200).json({
      message: "Testimonials retrieved successfully",
      data: testimonials,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getTestimonials };

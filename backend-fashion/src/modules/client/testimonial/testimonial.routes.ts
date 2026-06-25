import express from "express";
import { getTestimonials } from "./testimonial.controller";

const router = express.Router();

router.get("/testimonials", getTestimonials);

export default router;

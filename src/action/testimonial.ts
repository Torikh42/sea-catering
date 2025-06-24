"use server";
import { prisma } from "../../prisma/prisma";

export async function createTestimonial(data: {
  name: string;
  message: string;
  rating: number;
}) {
  return prisma.testimonial.create({
    data,
  });
}

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

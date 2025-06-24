"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { createTestimonial } from "@/action/testimonial";

export default function TestimonialForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTestimonial({ name, message, rating });
      setName("");
      setMessage("");
      setRating(5);
      alert("Testimonial submitted!");
    } catch {
      alert("Failed to submit testimonial.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md mx-auto space-y-3">
      <h2 className="font-bold text-lg">Submit Testimonial</h2>
      <div>
        <Label htmlFor="name">Customer Name</Label>
        <Input required id="name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="message">Review Message</Label>
        <Input required id="message" value={message} onChange={e => setMessage(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="rating">Rating</Label>
        <select
          id="rating"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          className="w-full border rounded px-2 py-1"
        >
          {[5, 4, 3, 2, 1].map(n => (
            <option key={n} value={n}>{n} Star{n > 1 && "s"}</option>
          ))}
        </select>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
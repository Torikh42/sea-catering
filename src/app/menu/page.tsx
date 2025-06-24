"use client"
import MealPlanCard from '@/components/MealPlanCard'
import React from 'react'

const page = () => {
  // Sample data untuk testing
  const sampleMealPlan = {
    name: "Paket Sehat Harian",
    price: 45000,
    description: "Menu seimbang dengan protein, karbohidrat, dan sayuran segar untuk kebutuhan harian Anda",
    image: "/images/healthy-meal.jpg", // Optional - bisa dikosongkan jika tidak ada gambar
    details: "Termasuk nasi merah, ayam panggang, sayur kangkung, dan buah segar"
  };

  const handleSeeMore = () => {
    console.log("See more clicked!");
    // Tambahkan logic untuk show detail atau redirect
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Menu Kami</h1>
      <MealPlanCard 
        plan={sampleMealPlan} 
        onSeeMore={handleSeeMore}
      />
    </div>
  )
}

export default page
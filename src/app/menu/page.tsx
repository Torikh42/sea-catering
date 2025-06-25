// app/menu/page.tsx
import React from 'react'
import { getAllMealPlans } from '@/action/menu'
import MealPlanList from '@/components/MealPlanList'

const MenuPage = async () => {
  const mealPlans = await getAllMealPlans()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Menu Kami</h1>
      <MealPlanList plans={mealPlans} />
    </div>
  )
}

export default MenuPage

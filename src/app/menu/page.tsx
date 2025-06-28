// app/menu/page.tsx
import React from 'react'
import { getAllMealPlans } from '@/action/menu'
import MealPlanList from '@/components/MealPlanList'

const MenuPage = async () => {
  const mealPlans = await getAllMealPlans()

  return (
      <MealPlanList plans={mealPlans} />
  )
}

export default MenuPage

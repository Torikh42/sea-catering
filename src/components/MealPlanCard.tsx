'use client'

import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from './ui/card'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import Image from 'next/image'

type SimplifiedMealPlan = {
  name: string
  price: number
  description: string
  image?: string
}

export default function MealPlanCard({ plan }: { plan: SimplifiedMealPlan }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card className="mx-auto w-full max-w-xs">
        <CardHeader>
          <CardTitle>{plan.name}</CardTitle>
          <CardDescription>
            Rp{plan.price.toLocaleString('id-ID')}/meal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plan.image && (
            <Image
              src={plan.image}
              alt={plan.name}
              className="mb-2 h-32 w-full rounded object-cover"
              width={200}
              height={200}
            />
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => setOpen(true)}>
            See More Details
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{plan.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p><strong>Harga:</strong> Rp{plan.price.toLocaleString('id-ID')}/meal</p>
            <p><strong>Deskripsi:</strong> {plan.description}</p>
            {plan.image && (
              <Image
                src={plan.image}
                alt={plan.name}
                className="rounded mt-2"
                width={400}
                height={250}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SerializableSubscription, getUserSubscriptions } from '@/action/userDashboard';
import { SubscriptionCard } from '@/components/SubscriptionCard'; 

interface SubscriptionListProps {
    initialSubscriptions: SerializableSubscription[];
}

export function SubscriptionList({ initialSubscriptions }: SubscriptionListProps) {
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchSubscriptions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getUserSubscriptions();
            setSubscriptions(data);
        } catch (err) {
            console.error('Failed to fetch subscriptions:', err);
            setError('Gagal memuat ulang data langganan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-500">Memuat data langganan...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                <p className="font-bold">Error!</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {subscriptions.length > 0 ? (
                subscriptions.map((sub) => (
                    <SubscriptionCard 
                        key={sub.id} 
                        subscription={sub} 
                        onUpdate={fetchSubscriptions} 
                    />
                ))
            ) : (
                <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-6 rounded-lg text-center shadow-inner">
                    <h2 className="text-2xl font-semibold mb-2">Belum ada langganan aktif.</h2>
                    <p>Ayo mulai langganan pertama Anda sekarang!</p>
                    <button onClick={() => router.push('/subscribe')} className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                        Buat Langganan
                    </button>
                </div>
            )}
        </div>
    );
}
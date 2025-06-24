import { LihatMenuButton } from '@/components/LihatMenuButton';
import React from 'react'

const features = [
  "Kustomisasi menu sesuai kebutuhan Anda",
  "Pengiriman ke seluruh kota besar di Indonesia",
  "Informasi nutrisi lengkap di setiap menu",
  "Bahan segar & berkualitas tinggi",
  "Layanan pelanggan responsif"
];

export default function Homepage() {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-10 min-h-[80vh] bg-white">
      <div className="flex flex-col items-center gap-4 max-w-xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-600">SEA Catering</h1>
        <p className="text-blue-500 text-lg font-semibold">“Healthy Meals, Anytime, Anywhere”</p>
        <p className="text-gray-700 mt-2">
          Selamat datang di <span className="font-semibold text-green-600">SEA Catering</span>! Kami menyediakan layanan katering sehat yang dapat dikustomisasi dan siap antar ke seluruh Indonesia. Nikmati kemudahan memilih menu sesuai kebutuhan nutrisi Anda, dengan bahan segar dan pengiriman cepat.
        </p>
        <LihatMenuButton></LihatMenuButton>
        <ul className="mt-4 text-left space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✔️</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 bg-gray-100 rounded-lg p-4 w-full max-w-xs mx-auto shadow">
          <div className="font-semibold text-gray-700">Hubungi Kami</div>
          <div className="text-sm text-gray-600 mt-1">Manager: Brian</div>
          <div className="text-sm text-gray-600">Telp: <a href="tel:08123456789" className="text-blue-600 hover:underline">08123456789</a></div>
        </div>
      </div>
    </main>
  );
}
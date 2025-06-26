"use client"

import React from "react";
import { Mail, Phone, MapPin, Clock, Users } from "lucide-react";

const contactItems = [
  {
    icon: <Phone className="h-12 w-12 text-blue-600" />,
    title: "Telepon",
    subtitle: "Manager: Brian",
    linkText: "08123456789",
    href: "tel:08123456789",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    hoverBg: "hover:bg-blue-100",
  },
  {
    icon: <Mail className="h-12 w-12 text-green-600" />,
    title: "Email",
    subtitle: "Pertanyaan Umum",
    linkText: "info@seacatering.com",
    href: "mailto:info@seacatering.com",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    hoverBg: "hover:bg-green-100",
  },
  {
    icon: <MapPin className="h-12 w-12 text-purple-600" />,
    title: "Alamat",
    subtitle: "Jl. Manggis No. 45\nCibinong, West Java",
    linkText: "Lihat di Maps",
    href: "https://maps.google.com/?q=Jl.+Manggis+No.+45+Cibinong+West+Java",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-800",
    hoverBg: "hover:bg-purple-100",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 px-4 py-12">
      {/* Hero Section */}
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            Tim Customer Service Siap Melayani
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kami siap membantu mewujudkan acara catering terbaik untuk Anda. 
            Hubungi tim profesional kami untuk konsultasi dan penawaran terbaik.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {contactItems.map((item, index) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-2xl ${item.bg} ${item.border} border-2 p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl ${item.hoverBg} cursor-pointer`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'slideInUp 0.6s ease-out forwards'
              }}
            >
              {/* Decorative background pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                <div className="w-full h-full rounded-full bg-current transform translate-x-8 -translate-y-8"></div>
              </div>
              
              <div className="relative z-10">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-2xl bg-white p-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    {item.icon}
                  </div>
                </div>
                
                <h3 className={`text-2xl font-bold ${item.text} mb-3`}>
                  {item.title}
                </h3>
                
                <p className={`text-lg font-medium ${item.text} opacity-80 mb-4 whitespace-pre-line`}>
                  {item.subtitle}
                </p>
                
                {item.href && item.linkText && (
                  <a
                    href={item.href}
                    className={`inline-flex items-center gap-2 ${item.text} font-semibold text-lg hover:underline transition-all duration-200 hover:gap-3`}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {item.linkText}
                    <span className="text-sm">→</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Operating Hours Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-gray-600 mb-4">
              <Clock className="h-6 w-6" />
              <span className="text-lg font-semibold">Jam Operasional</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-gray-700">
              <div className="text-center">
                <h4 className="font-semibold text-lg mb-2">Senin - Jumat</h4>
                <p className="text-xl font-medium text-blue-600">08:00 - 17:00 WIB</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-lg mb-2">Sabtu - Minggu</h4>
                <p className="text-xl font-medium text-green-600">09:00 - 15:00 WIB</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-yellow-800 font-medium">
                💡 <strong>Tips:</strong> Untuk pesanan besar atau acara khusus, 
                hubungi kami minimal 3 hari sebelumnya untuk hasil terbaik.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
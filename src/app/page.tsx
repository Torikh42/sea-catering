import { LihatMenuButton } from "@/components/LihatMenuButton";
import React from "react";
import Image from "next/image";
import TestimonialForm from "@/components/TestimonialForm"; // Import the form
import TestimonialCarousel from "@/components/TestimonialCarousel"; // Import the carousel
import Link from "next/link"; // For the new button below LihatMenuButton
import { Button } from "@/components/ui/button"; // For the new button

const features = [
  "Kustomisasi menu sesuai kebutuhan Anda",
  "Pengiriman ke seluruh kota besar di Indonesia",
  "Informasi nutrisi lengkap di setiap menu",
  "Bahan segar & berkualitas tinggi",
  "Layanan pelanggan responsif",
];

export default function Homepage() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative flex w-full max-w-7xl flex-col items-center justify-between gap-12 px-4 py-16 text-center md:flex-row md:py-24 md:text-left">
        <div className="z-10 flex flex-col items-center gap-6 md:items-start">
          <h1 className="text-4xl leading-tight font-extrabold text-green-700 sm:text-5xl md:text-6xl">
            SEA Catering
          </h1>
          <p className="text-xl font-bold text-blue-600 sm:text-2xl">
            “Healthy Meals, Anytime, Anywhere”
          </p>
          <p className="max-w-xl text-lg leading-relaxed text-gray-800">
            Selamat datang di{" "}
            <span className="font-semibold text-green-700">SEA Catering</span>!
            Kami menyediakan layanan katering sehat yang dapat dikustomisasi dan
            siap antar ke seluruh Indonesia. Nikmati kemudahan memilih menu
            sesuai kebutuhan nutrisi Anda, dengan bahan segar dan pengiriman
            cepat.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            {" "}
            {/* Container for buttons */}
            <LihatMenuButton />
            <Button
              asChild
              className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-700"
            >
              <Link href="#give-testimonial">Berikan Testimonial</Link>
            </Button>
          </div>
        </div>
        {/* Image on the right for larger screens */}
        <div className="relative z-0 mt-8 aspect-square w-full max-w-sm overflow-hidden rounded-full shadow-2xl md:mt-0 md:max-w-md lg:max-w-lg">
          <Image
            src="/image-sea.png"
            alt="Delicious healthy meal from SEA Catering"
            layout="fill"
            objectFit="cover"
            priority
            className="rounded-full"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="my-12 w-full max-w-7xl rounded-xl bg-white px-4 py-16 shadow-lg">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-800">
          Mengapa Memilih SEA Catering?
        </h2>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <li
              key={idx}
              className="flex transform items-start gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <span className="flex-shrink-0 text-2xl text-green-500">✨</span>{" "}
              <span className="text-lg text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact Section */}
      <section className="mb-12 flex w-full max-w-7xl flex-col items-center rounded-xl bg-blue-700 px-4 py-12 text-center text-white shadow-lg">
        <h2 className="mb-4 text-3xl font-bold">
          Siap untuk Hidup Lebih Sehat?
        </h2>
        <p className="mb-6 max-w-prose text-lg">
          Hubungi kami sekarang untuk memulai perjalanan makan sehat Anda. Tim
          kami siap membantu Anda menyesuaikan menu terbaik!
        </p>
        <div className="mx-auto mt-4 w-full max-w-sm rounded-lg bg-blue-800 p-6 shadow-xl">
          <div className="mb-2 text-2xl font-bold text-white">Hubungi Kami</div>
          <div className="mt-1 text-lg text-blue-200">Manager: Brian</div>
          <div className="text-lg text-blue-200">
            Telp:{" "}
            <a
              href="tel:08123456789"
              className="font-semibold text-white hover:underline"
            >
              08123456789
            </a>
          </div>
        </div>
      </section>

      {/* Testimonial Form Section */}
      <section
        id="give-testimonial"
        className="my-12 w-full max-w-7xl px-4 py-16"
      >
        <TestimonialForm />
      </section>

      {/* Testimonial Carousel Section */}
      <section id="testimonials-carousel" className="w-full py-16">
        {" "}
        {/* Removed max-w-7xl for full width carousel look */}
        <TestimonialCarousel />
      </section>
    </main>
  );
}

// "use server"; // <-- WAJIB: Ini menandakan file ini adalah Server Action

// import { PrismaClient } from '@prisma/client';
// import { toast } from 'sonner'; // Kita akan tetap menggunakan toast di client-side untuk feedback.
// // Namun, validasi dan error handling utama akan di Server Action.

// const prisma = new PrismaClient();

// interface CreateSubscriptionInput {
//   fullName: string;
//   phone: string;
//   plan: string;
//   mealTypes: string[];
//   deliveryDays: string[];
//   allergies?: string;
//   totalPrice: number;
// }

// export async function createSubscription(data: CreateSubscriptionInput) {
//   try {
//     // Basic server-side validation (lebih lengkap bisa ditambahkan di sini)
//     if (!data.fullName || !data.phone || data.mealTypes.length === 0 || data.deliveryDays.length === 0 || data.totalPrice <= 0) {
//       return { success: false, message: "Missing required fields or invalid total price." };
//     }

//     if (!/^\d+$/.test(data.phone)) {
//         return { success: false, message: "Phone number must contain only digits." };
//     }

//     // TODO: VALIDASI SERVER-SIDE LEBIH LANJUT
//     // Anda bisa menambahkan validasi lebih ketat di sini, contoh:
//     // - Validasi email jika nanti ada (dari userId)
//     // - Validasi plan yang dipilih (apakah ada di daftar plan yang valid)
//     // - Validasi total harga (hitung ulang di server untuk mencegah manipulasi client)

//     // Simulasi user ID (ini harusnya didapatkan dari session pengguna yang sedang login)
//     // Untuk tujuan demo, kita pakai ID dummy. Dalam aplikasi nyata, ini dari auth.
//     // Anda perlu menyesuaikan ini dengan bagaimana Anda mengelola otentikasi pengguna.
//     // Misalnya, jika menggunakan NextAuth.js, Anda akan mendapatkan session.user.id.
//     // const session = await getAuthSession(); // Misalnya
//     // const userId = session?.user?.id || 'clx8k8x390000r39v2x4r7z0e'; // Ganti dengan ID user yang sebenarnya
//     // PRISMA CLIENT MENGHARAPKAN USERID YANG ADA DI DATABASE
//     // Untuk saat ini, kita akan membuat Subscription tanpa UserID jika belum ada user yang login.
//     // JIKA ANDA MENGINGINKAN SUBSCRIPTION TERKAIT DENGAN USER,
//     // ANDA HARUS MENGUBAH MODEL PRISMA Subscription AGAR userId TIDAK WAJIB (opsional)
//     // ATAU PASTIKAN ADA userId YANG VALID.

//     // Untuk demo ini, kita akan asumsikan userId ada atau buat dummy.
//     // Jika Subscription harus terhubung ke User, dan User belum login,
//     // maka ini akan gagal.
//     // JANGAN GUNAKAN ID DUMMY DI PRODUKSI. HARUS DARI AUTH SESSION.

//     // Contoh mendapatkan user dari database
//     const existingUser = await prisma.user.findFirst(); // Hanya untuk demo, ambil user pertama
//     if (!existingUser) {
//         // Ini skenario yang perlu Anda tangani: user belum login atau tidak ditemukan
//         // Dalam aplikasi nyata, Anda mungkin akan redirect ke halaman login/signup
//         return { success: false, message: "User not found. Please log in or sign up first." };
//     }
//     const userId = existingUser.id;


//     const newSubscription = await prisma.subscription.create({
//       data: {
//         userId: userId, // Pastikan userId ini valid dan ada di tabel User
//         fullName: data.fullName,
//         phone: data.phone,
//         plan: data.plan,
//         mealTypes: data.mealTypes.join(','), // Simpan sebagai string yang dipisahkan koma
//         deliveryDays: data.deliveryDays.join(','), // Simpan sebagai string yang dipisahkan koma
//         allergies: data.allergies || null,
//         totalPrice: data.totalPrice,
//       },
//     });

//     console.log("New subscription created:", newSubscription);
//     return { success: true, message: "Subscription created successfully!", subscription: newSubscription };
//   } catch (error) {
//     console.error("Error creating subscription:", error);
//     // Lebih detail error handling, misalnya cek jenis error Prisma
//     return { success: false, message: "Failed to create subscription. Please try again." };
//   }
// }
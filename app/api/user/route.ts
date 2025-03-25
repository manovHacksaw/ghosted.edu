// import { NextResponse } from "next/server";
// import prisma from "@/lib/prismaclient/prisma";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { OCId } = body;

//     if (!OCId) {
//       return NextResponse.json({ error: "OCId is required" }, { status: 400 });
//     }

//     // Check if user exists

//     const existingUser = await prisma.user.findUnique({
//       where: { OCId },
//     });

//     if (!existingUser) {
//       const newUser = await prisma.user.create({
//         data: { 
//           OCId,
//           isOnboarded: false 
//         },
//       });

//       return NextResponse.json(
//         {
//           user: newUser,
//           isFirstTimeLogin: true,
//           message: "User created successfully",
//         },
//         { status: 201 }
//       );
//     } else {
//       return NextResponse.json(
//         {
//           user: existingUser,
//           isFirstTimeLogin: false,
//           message: "User logged in successfully",
//         },
//         { status: 200 }
//       );
//     }
//   } catch (error: any) {
//     console.error("Login processing error:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to process login",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }

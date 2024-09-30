import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    // console.log("🚀 ~ POST ~ customer:", customer)
  // const ephemeralKey = await stripe.ephemeralKeys.create(
  //   {customer: customer.id},
  //   {apiVersion: '2024-06-20'}
  // );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount* 100,
    currency: 'pkr',
    payment_method_types: ["card"],
  })

  return NextResponse.json({
    paymentIntent: paymentIntent.client_secret,
    // ephemeralKey: ephemeralKey.secret,
  },{ headers: corsHeaders });
}
  catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

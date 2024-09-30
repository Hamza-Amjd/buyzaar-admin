import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { cartItems, customerInfo,total,address } = await req.json();

    if (!cartItems || !customerInfo || !total || !address) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }
      
      const orderItems = cartItems?.map((item: any) => {
        return {
          product: item.item._id,
          color: item.color || "N/A",
          size: item.size || "N/A",
          quantity: item.quantity,
        }
      })
      const shippingAddress = {
        name: address?.name,
        line1: address?.address?.line1,
        line2: address?.address?.line2,
        city: address?.address?.city,
        state:address?.address?.state,
        postalCode: address?.address?.postalCode,
        country: address?.address?.country,
        phone:address?.phone
      }
      await connectToDB()

      const newOrder = new Order({
        customerClerkId: customerInfo.clerkId,
        products: orderItems,
        shippingAddress,
        shippingRate: "300",
        totalAmount: total,
      })

      await newOrder.save()

      let customer = await Customer.findOne({ clerkId: customerInfo.clerkId })

      if (customer) {
        customer.orders.push(newOrder._id)
      } else {
        customer = new Customer({
          ...customerInfo,
          orders: [newOrder._id],
        })
      }

      await customer.save()
      return new NextResponse("Order created", { status: 200 })
    }

   catch (err) {
    console.log("[webhooks_POST]", err)
    return new NextResponse("Failed to create the order", { status: 500 })
  }
}
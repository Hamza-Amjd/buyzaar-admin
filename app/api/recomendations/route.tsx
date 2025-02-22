import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB()

    const {wishlist,searchHistory} = await req.json()
    
    console.log("Wishlist: ", wishlist);
    
    const recommendedProducts = await Product.find({
      $or: [
        { _id: { $in: wishlist } }, // Match products in the wishlist
        // { name: { $in: searchHistory } } // Match products based on search history
      ]
    })
    // if (!product) {
    //   return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 })
    // }


    // if (!recommendedProducts) {
    //   return new NextResponse(JSON.stringify({ message: "No related products found" }), { status: 404 })
    // }

    return NextResponse.json(recommendedProducts, { status: 200 })
  } catch (err) {
    console.log("[related_GET", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic";

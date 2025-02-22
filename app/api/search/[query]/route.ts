import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { query: string } }) => {
  try {
    await connectToDB()

    const url = req.nextUrl;
    const maxPrice = url.searchParams.get("maxPrice"); // Get maxPrice query parameter
    const minPrice = url.searchParams.get("minPrice"); // Get maxPrice query parameter
    const priceSort = url.searchParams.get("priceSort"); // Get price sort query parameter
    console.log(minPrice, maxPrice,priceSort);

    let searchedProducts = await Product.find({
      $or: [
        { title: { $regex: params.query, $options: "i" } },
        { category: { $regex: params.query, $options: "i" } },
        { tags: { $in: [new RegExp(params.query, "i")] } } // $in is used to match an array of values
      ]
    })
    // Apply price filters
    if (minPrice) {
      searchedProducts = searchedProducts.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      searchedProducts = searchedProducts.filter(product => product.price <= parseFloat(maxPrice));
    }
    
    // Sort products based on priceSort parameter
    if (priceSort === "asc") {
      searchedProducts.sort((a, b) => a.price - b.price);
    } else if (priceSort === "desc") {
      searchedProducts.sort((a, b) => b.price - a.price);
    }

    return NextResponse.json(searchedProducts, { status: 200 })
  } catch (err) {
    console.log("[search_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export const dynamic = "force-dynamic";

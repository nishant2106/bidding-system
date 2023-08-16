import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NewProduct } from "./components/new.product";

export default async function Home() {
  const { rows } = await sql`SELECT * FROM bids ORDER BY id DESC`;
  const addProduct = async (product: string) => {
    "use server";

    const login = cookies().get("login");
    const { rows } =
      await sql`INSERT INTO bids (name, owner, total_bids) VALUES(${product}, ${login?.value!}, 0) RETURNING id`;
    revalidatePath("/");
  };
  const login = cookies().get("login");

  return (
    <div className="text-black container mx-auto p-4 border-l border-white border-r min-h-[100vh]">
      <div className="flex">
        <h1 className="flex-1 text-3xl font-bold mb-4 text-white">
          Product Listing ({login?.value!})
        </h1>
      </div>
      <NewProduct addProduct={addProduct} />
      <div className="grid grid-cols-3 gap-4">
        {rows.map((product) => (
          <div key={product.id} className="bg-white border border-gray-300 p-4">
            <div className="text-lg mb-2">
              <strong>Product Name</strong>: {product.name}
            </div>
            <div className="text-lg mb-2">
              <strong>Owner</strong>: {product.owner}
            </div>
            <div className="text-lg">
              <strong>Current Bid</strong>: {product.total_bids}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

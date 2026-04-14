import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { useState } from "react";

import { ChevronDown, Edit, Plus, Search, Trash } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Switch from "@/shared/components/ui/switch";
import AddProductDialog, {
  type ProductFormData,
} from "../components/AddProductDialog";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<{
    index: number;
    data: {
      image: string | null;
      name: string;
      category: string;
      description: string;
      price: string;
      discountType: string;
      status: "Available" | "Out of Stock";
    };
  } | null>(null);

  const [products, setProducts] = useState([
    {
      image: "path/to/image1.jpg",
      name: "Kunafa Tiramisu",
      category: "Pastries",
      price: "EGP 85.20",
      discount: "EGP 25.00",
      isAvailable: true,
    },
    {
      image: "path/to/image2.jpg",
      name: "Eish el Saraya",
      category: "Pastries",
      price: "EGP 85.20",
      discount: "30%",
      isAvailable: true,
    },
    {
      image: "path/to/image3.jpg",
      name: "Middle Eastern Roast Beef",
      category: "Pastries",
      price: "EGP 85.20",
      discount: null,
      isAvailable: false,
    },
    {
      image: "path/to/image4.jpg",
      name: "Amber Sobia",
      category: "Coffee",
      price: "EGP 85.20",
      discount: null,
      isAvailable: true,
    },
    {
      image: "path/to/image5.jpg",
      name: "Blueberry Croissant",
      category: "Pastries",
      price: "EGP 85.20",
      discount: null,
      isAvailable: true,
    },
    {
      image: "path/to/image6.jpg",
      name: "Chemex",
      category: "Coffee",
      price: "EGP 85.20",
      discount: null,
      isAvailable: false,
    },
    {
      image: "path/to/image7.jpg",
      name: "The Classic Turkey",
      category: "Sandwiches",
      price: "EGP 85.20",
      discount: null,
      isAvailable: true,
    },
  ]);

  const categories = ["All Categories", "Pastries", "Coffee", "Sandwiches"];

  const handleAddProduct = (
    productData: ProductFormData,
    productIndex?: number
  ) => {
    let discount: string | null = null;
    if (productData.discountType !== "None" && productData.discountValue) {
      if (productData.discountType === "Percentage") {
        discount = `${productData.discountValue}%`;
      } else {
        discount = `EGP ${productData.discountValue}`;
      }
    }

    const newProduct = {
      image: productData.image
        ? URL.createObjectURL(productData.image)
        : "path/to/default-image.jpg",
      name: productData.productName,
      category: productData.category,
      price: `EGP ${parseFloat(productData.price).toFixed(2)}`,
      discount,
      isAvailable: productData.status === "Available",
    };

    if (productIndex !== undefined) {
      setProducts((prev) =>
        prev.map((product, i) =>
          i === productIndex ? { ...product, ...newProduct } : product
        )
      );
      setEditingProduct(null);
    } else {
      setProducts((prev) => [newProduct, ...prev]);
    }
    setIsAddProductDialogOpen(false);
  };

  const handleStatusToggle = (index: number, checked: boolean) => {
    setProducts((prev) =>
      prev.map((product, i) =>
        i === index ? { ...product, isAvailable: checked } : product
      )
    );
  };

  const handleEditProduct = (index: number) => {
    const product = products[index];
    setEditingProduct({
      index,
      data: {
        image: product.image,
        name: product.name,
        category: product.category,
        description: "",
        price: product.price.replace("EGP ", ""),
        discountType: "",
        status: product.isAvailable ? "Available" : "Out of Stock",
      },
    });
    setIsAddProductDialogOpen(true);
  };

  const handleDeleteProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-bold text-[32px]">Products</h1>
          <p className="font-normal text-[16px] text-gray-600">
            Manage your bakery and coffee menu
          </p>
        </div>
        <Button
          onClick={() => setIsAddProductDialogOpen(true)}
          className="text-white font-semibold px-7.5 py-4 h-14 rounded-[5px]"
        >
          <Plus size={20} />
          Add New Product
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-8 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 bg-white p-3.5 rounded-lg border border-[#cacbd4]">
            <Search className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="font-normal text-[16px] text-[#8b8b8b] w-full focus:outline-none"
            />
          </div>
        </div>

        <div className="w-80">
          <div className="flex items-center gap-3 bg-white px-4.5 py-3 rounded-xl border border-neutral-200">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="font-medium text-[16px] text-black w-full focus:outline-none appearance-none bg-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-40">Actions</TableHead>{" "}
            {/* Natural alignment */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product, index) => (
            <TableRow key={index} className="h-16">
              {/* Image */}
              <TableCell className="align-middle">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-md object-cover"
                />
              </TableCell>

              {/* Product Name */}
              <TableCell className="align-middle font-medium">
                {product.name}
              </TableCell>

              {/* Category */}
              <TableCell className="align-middle">
                <span className="px-3 py-1 rounded-full bg-primary text-white text-sm font-medium">
                  {product.category}
                </span>
              </TableCell>

              {/* Price */}
              <TableCell className="align-middle">
                <div className="flex flex-col">
                  <span className="font-medium">{product.price}</span>
                  {product.discount && (
                    <span className="text-sm text-gray-500">
                      Discount: {product.discount}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Status */}
              <TableCell className="align-middle">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.isAvailable
                      ? "bg-[#EDF8F0] text-[#059B5A]"
                      : "bg-[#DCDCDC] text-[#23252A]"
                  }`}
                >
                  {product.isAvailable ? "Available" : "Out of Stock"}
                </span>
              </TableCell>

              {/* Actions - Now naturally aligned */}
              <TableCell className="align-middle">
                <div className="flex items-center gap-4">
                  <Switch
                    checked={product.isAvailable}
                    onCheckedChange={(checked) =>
                      handleStatusToggle(index, checked)
                    }
                  />
                  <Edit
                    className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                    onClick={() => handleEditProduct(index)}
                  />
                  <Trash
                    className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${product.name}"?`
                        )
                      ) {
                        handleDeleteProduct(index);
                      }
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Product Dialog */}
      <AddProductDialog
        isOpen={isAddProductDialogOpen}
        onOpenChange={(open) => {
          setIsAddProductDialogOpen(open);
          if (!open) {
            setEditingProduct(null);
          }
        }}
        onSave={handleAddProduct}
        editingProduct={editingProduct || undefined}
      />
    </div>
  );
};

export default ProductsPage;

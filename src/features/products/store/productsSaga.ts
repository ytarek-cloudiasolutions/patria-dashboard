import { all, call, put, takeLatest, select } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productsApi";
import { getProductErrorMessage } from "../utils/productHelpers";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import { productsActions } from "./productsSlice";
import { selectProducts } from "./productsSelectors";
import type { RootState } from "@/app/store";
import type { Product, Category } from "../types";
import { getCategories } from "@/features/categories/api/categoriesApi";
import { mapCategories } from "@/features/categories/utils/categoryMappers";
import { selectCategories } from "@/features/categories/store/categoriesSelectors";
import type {
  GetProductsRequest,
  GetProductsResponse,
  CreateProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
} from "./productTypes";

function* handleGetProducts(action: PayloadAction<GetProductsRequest | undefined>) {
  try {
    const response: GetProductsResponse = yield call(getProducts, action.payload);
    yield put(
      productsActions.getProductsSuccess({
        products: response.products || [],
        pagination: {
          page: response.page || 1,
          pages: response.pages || 1,
          total: response.total || 0,
        },
      }),
    );
  } catch (error) {
    const errorMessage = getProductErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(productsActions.getProductsFailure(errorMessage));
  }
}

function* handleCreateProduct(action: PayloadAction<FormData>) {
  try {
    const response: CreateProductResponse = yield call(
      createProduct,
      action.payload,
    );
    const product = response.data?.product || (response as any).product || response;
    yield call(showSuccessToast, "Product created successfully");
    yield put(
      productsActions.createProductSuccess({
        product,
        message: "Product created successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getProductErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(productsActions.createProductFailure(errorMessage));
  }
}

function* handleUpdateProduct(
  action: PayloadAction<{ productId: string; formData: FormData }>,
) {
  try {
    const { productId, formData } = action.payload;
    const response: UpdateProductResponse = yield call(
      updateProduct,
      productId,
      formData,
    );
    const product = response.data?.product || (response as any).product || response;
    yield call(showSuccessToast, "Product updated successfully");
    yield put(
      productsActions.updateProductSuccess({
        product,
        message: "Product updated successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getProductErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(productsActions.updateProductFailure(errorMessage));
  }
}

function* handleDeleteProduct(action: PayloadAction<{ productId: string }>) {
  try {
    const { productId } = action.payload;
    const response: DeleteProductResponse = yield call(deleteProduct, productId);
    yield call(showSuccessToast, response.message || "Product deleted successfully");
    yield put(
      productsActions.deleteProductSuccess({
        productId,
        message: response.message || "Product deleted successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getProductErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(productsActions.deleteProductFailure(errorMessage));
  }
}

function* handleToggleProductActive(
  action: PayloadAction<{ productId: string; isActive: boolean }>,
) {
  try {
    const { productId, isActive } = action.payload;
    const products: Product[] = yield select(selectProducts);
    const product = products.find((p) => p.id === productId);
    if (!product) {
      throw new Error("Product not found");
    }

    let categories: Category[] = yield select(
      (state: RootState) => state.categories.categories,
    );
    if (categories.length === 0) {
      const response: any[] = yield call(getCategories);
      categories = mapCategories(response || []);
    }

    const selectedCat = categories.find(
      (c) =>
        c.name.toLowerCase() === product.category.toLowerCase() ||
        c.id === product.category,
    );
    let categoryId = selectedCat ? selectedCat.id : product.category;

    // Validate if it is a 24-character hexadecimal ObjectId. If not, use first category as fallback
    if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
      if (categories.length > 0) {
        categoryId = categories[0].id;
      }
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", String(product.price));
    formData.append("categoryId", categoryId);
    formData.append("isActive", String(isActive));

    const mappedVariantGroups = (product.variantGroups || []).map((g: any) => ({
      name: g.name,
      required: g.required,
      options: (g.options || []).map((o: any) => ({
        name: o.name,
        label: o.name,
        priceAdjustment: Number(o.price) || 0,
      })),
    }));
    formData.append("variantGroups", JSON.stringify(mappedVariantGroups));

    const mappedExtras = (product.extras || []).map((e: any) => ({
      name: e.name,
      price: Number(e.price) || 0,
    }));
    formData.append("extras", JSON.stringify(mappedExtras));

    const response: UpdateProductResponse = yield call(
      updateProduct,
      productId,
      formData,
    );
    const updatedProduct = response.data?.product || (response as any).product || response;
    yield call(showSuccessToast, "Product status updated successfully");
    yield put(
      productsActions.toggleProductActiveSuccess({
        product: updatedProduct,
        message: "Product status updated successfully",
      }),
    );
  } catch (error) {
    const errorMessage = getProductErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(productsActions.toggleProductActiveFailure(errorMessage));
  }
}

function* handleGetIngredients() {
  try {
    let categories: Category[] = yield select(selectCategories);
    if (categories.length === 0) {
      const response: any[] = yield call(getCategories);
      categories = mapCategories(response || []);
    }
    const rawCat = categories.find(
      (c) => c.name.toLowerCase() === "raw ingredients",
    );
    const categoryId = rawCat ? rawCat.id : undefined;

    const response: GetProductsResponse = yield call(getProducts, {
      category: categoryId,
      limit: 100,
    });
    yield put(productsActions.getIngredientsSuccess(response.products || []));
  } catch (error) {
    const errorMessage = getProductErrorMessage(error);
    yield put(productsActions.getIngredientsFailure(errorMessage));
  }
}

export default function* productsSaga() {
  yield all([
    takeLatest(productsActions.getProductsRequest.type, handleGetProducts),
    takeLatest(productsActions.getIngredientsRequest.type, handleGetIngredients),
    takeLatest(productsActions.createProductRequest.type, handleCreateProduct),
    takeLatest(productsActions.updateProductRequest.type, handleUpdateProduct),
    takeLatest(productsActions.deleteProductRequest.type, handleDeleteProduct),
    takeLatest(
      productsActions.toggleProductActiveRequest.type,
      handleToggleProductActive,
    ),
  ]);
}

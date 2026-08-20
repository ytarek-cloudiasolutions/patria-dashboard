import { all, call, put, takeLatest, select } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from "../api/productsApi";
import { getProductErrorMessage } from "../utils/productHelpers";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import { productsActions } from "./productsSlice";
import type { Category } from "../types";
import { getCategories } from "@/features/categories/api/categoriesApi";
import { mapCategories } from "@/features/categories/utils/categoryMappers";
import { selectCategories } from "@/features/categories/store/categoriesSelectors";
import { saveRecipe, deleteRecipe } from "../api/recipeApi";
import type {
  GetProductsRequest,
  GetProductsResponse,
  CreateProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
} from "./productTypes";

function* handleGetProducts(
  action: PayloadAction<GetProductsRequest | undefined>,
): Generator<any, void, any> {
  try {
    const response: any = (yield call(getProducts, action.payload)) as any;
    const rawProds = response.products || response.data?.products || response.data || [];
    const pag = response.pagination || response.data?.pagination || response;
    const pageNum = pag.page || response.page || action.payload?.page || 1;
    const totalPages = pag.pages || pag.totalPages || response.pages || response.totalPages || 1;
    const totalItems = pag.total || response.total || rawProds.length;

    yield put(
      productsActions.getProductsSuccess({
        products: rawProds,
        pagination: {
          page: pageNum,
          pages: totalPages,
          total: totalItems,
        },
      }),
    );
  } catch (error) {
    const errorMessage = getProductErrorMessage(error);
    yield call(showErrorToast, errorMessage);
    yield put(productsActions.getProductsFailure(errorMessage));
  }
}

function* handleCreateProduct(
  action: PayloadAction<FormData>,
): Generator<any, void, any> {
  try {
    const response: CreateProductResponse = (yield call(
      createProduct,
      action.payload,
    )) as CreateProductResponse;
    const product = response.data?.product || (response as any).product || response;
    const productId = String(product._id || product.id || "");

    const recipeStr = action.payload.get("recipe") as string;
    if (recipeStr && productId) {
      try {
        const recipeItems = JSON.parse(recipeStr);
        if (Array.isArray(recipeItems) && recipeItems.length > 0) {
          const ingredientsPayload = recipeItems.map((r: any) => ({
            productId: String(r.material || r.ingredientId || ""),
            quantity: Number(r.quantity) || 0,
            unit: r.unit || "pcs",
          }));
          yield call(saveRecipe, productId, { ingredients: ingredientsPayload });
        }
      } catch (recipeErr) {
        console.error("Failed to save product recipe:", recipeErr);
      }
    }

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
): Generator<any, void, any> {
  try {
    const { productId, formData } = action.payload;
    const response: UpdateProductResponse = (yield call(
      updateProduct,
      productId,
      formData,
    )) as UpdateProductResponse;
    const product = response.data?.product || (response as any).product || response;

    const recipeStr = formData.get("recipe") as string;
    if (recipeStr && productId) {
      try {
        const recipeItems = JSON.parse(recipeStr);
        if (Array.isArray(recipeItems) && recipeItems.length > 0) {
          const ingredientsPayload = recipeItems.map((r: any) => ({
            productId: String(r.material || r.ingredientId || ""),
            quantity: Number(r.quantity) || 0,
            unit: r.unit || "pcs",
          }));
          yield call(saveRecipe, productId, { ingredients: ingredientsPayload });
        } else {
          yield call(deleteRecipe, productId);
        }
      } catch (recipeErr) {
        console.error("Failed to update product recipe:", recipeErr);
      }
    }

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

function* handleDeleteProduct(
  action: PayloadAction<{ productId: string }>,
): Generator<any, void, any> {
  try {
    const { productId } = action.payload;
    try {
      yield call(deleteRecipe, productId);
    } catch {
      // Ignore if product had no recipe
    }
    const response: DeleteProductResponse = (yield call(
      deleteProduct,
      productId,
    )) as DeleteProductResponse;
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
): Generator<any, void, any> {
  try {
    const { productId } = action.payload;
    const response: UpdateProductResponse = (yield call(
      toggleProductStatus,
      productId,
    )) as UpdateProductResponse;
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

function* handleGetIngredients(): Generator<any, void, any> {
  try {
    let categories: Category[] = (yield select(selectCategories)) as Category[];
    if (categories.length === 0) {
      const response: any[] = (yield call(getCategories)) as any[];
      categories = mapCategories(response || []);
    }
    const rawCat = categories.find(
      (c) => c.name.toLowerCase() === "raw ingredients",
    );
    const categoryId = rawCat ? rawCat.id : undefined;

    const response: GetProductsResponse = (yield call(getProducts, {
      category: categoryId,
      limit: 100,
    })) as GetProductsResponse;
    yield put(productsActions.getIngredientsSuccess(response.products || []));
  } catch (error) {
    const errorMessage = getProductErrorMessage(error);
    yield put(productsActions.getIngredientsFailure(errorMessage));
  }
}

export default function* productsSaga(): Generator<any, void, any> {
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

import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByType,
  previewProductsByType,
  getNewestProducts,
} from "../controllers/EtalasalleController.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/product/:id", getProductById);
router.post("/product", createProduct);
router.patch("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);
router.get("/products/view/:type", getProductsByType);
router.get("/products/preview/:type", previewProductsByType);
router.get("/products/newest", getNewestProducts);
router.get("/products/search/:q", searchProducts);

export default router;
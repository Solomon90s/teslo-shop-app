import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Options } from '@products/interfaces/options.interface';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../auth/interfaces/user.interface';

const baseUrl = environment.baseUrl;
const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  #http = inject(HttpClient);

  #productsCache = new Map<string, ProductsResponse>();
  #productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    // console.log(this.#productsCache.entries());

    const key = `${limit}-${offset}-${gender}`;
    if (this.#productsCache.has(key)) {
      return of(this.#productsCache.get(key)!);
    }
    return this.#http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        },
      })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.#productsCache.set(key, resp))
      );
  }

  getProductByIdOrSlug(idSlug: string): Observable<Product> {
    const key = `${idSlug}`;
    if (this.#productsCache.has(key)) {
      return of(this.#productCache.get(key)!);
    }
    return this.#http
      .get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(tap((product) => this.#productCache.set(key, product)));
  }

  getProductById(id: string): Observable<Product> {
    if (id === 'new') {
      return of(emptyProduct);
    }

    const key = `${id}`;
    if (this.#productsCache.has(key)) {
      return of(this.#productCache.get(key)!);
    }
    return this.#http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((product) => this.#productCache.set(key, product)));
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>
  ): Observable<Product> {
    return this.#http
      .patch<Product>(`${baseUrl}/products/${id}`, productLike)
      .pipe(tap((product) => this.updateProductCache(product)));
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.#http
      .post<Product>(`${baseUrl}/products`, productLike)
      .pipe(tap((product) => this.updateProductCache(product)));
  }

  updateProductCache(product: Product) {
    const productId = product.id;
    this.#productCache.set(productId, product);

    this.#productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) =>
          currentProduct.id === productId ? product : currentProduct
      );
    });
    console.log('Caché actualizado');
  }
}

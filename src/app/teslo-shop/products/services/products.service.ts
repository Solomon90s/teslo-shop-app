import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Options } from '@products/interfaces/options.interface';
import {
  Gender,
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
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
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    const currentImages = productLike.images ?? [];
    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...productLike,
        images: [...currentImages, ...imageNames],
      })),
      switchMap((updatedProduct) =>
        this.#http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
      ),
      tap((product) => this.updateProductCache(product))
    );
  }

  createProduct(
    //TODO: Realizar el mismo procedimiento(subir imagen,uso de observable) que en el método updateProduct
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
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

  // Tome un FileList y lo suba
  uploadImages(images?: FileList): Observable<string[]> {
    //* si no hay imágenes devolvemos un observable, un array vacío
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map((imageFile) =>
      this.uploadImage(imageFile)
    );

    return forkJoin(uploadObservables).pipe(
      tap((imageNames) => console.log({ imageNames }))
    );
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.#http
      .post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }
}

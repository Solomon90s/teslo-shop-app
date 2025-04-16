import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Options } from '@products/interfaces/options.interface';
import {
  Product,
  ProductsResponse,
} from '@products/interfaces/product.interface';
import { delay, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  #http = inject(HttpClient);

  #productsCache = new Map<string, ProductsResponse>();
  #productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    console.log(this.#productsCache.entries());

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
}

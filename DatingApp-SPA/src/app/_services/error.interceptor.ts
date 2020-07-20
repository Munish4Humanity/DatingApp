import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            return throwError(error.statusText);
          }
          const applicationError = error.headers.get("Application-Error");
          if (applicationError) {
            console.error(applicationError);
            return throwError(applicationError);
          }
          const ServerError = error.error;
          let modalStateErrors = "";
          if (ServerError && typeof ServerError === "object") {
            for (const key in ServerError) {
              if (ServerError[key]) {
                modalStateErrors += ServerError[key] + "\n";
              }
            }
          }
          return throwError(modalStateErrors || ServerError || "Server Error");
        }
      })
    );
  }
}
export const ErrorInterceptorProvide = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};

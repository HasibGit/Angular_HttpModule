import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log("request is on its way");
    const modifiedRequest = req.clone({
      headers: req.headers.append("Auth", "XYZ"),
    });
    return next.handle(modifiedRequest).pipe(
      // we can also interact with the response as well.
      tap((event) => {
        // in the interceptor, u always get an event
        console.log(event);
        if (event.type === HttpEventType.Response) {
          console.log("Response Arrived");
          console.log(event.body);
        }
      })
    );
  }
}

import {
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpErrorResponse,
    HttpInterceptor
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { LoadingDialogService } from "./loading-service.service";
import { Injectable } from "@angular/core";
import { UserDetailsService } from "./user-details.service";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    constructor(
        private loadingDialogService: LoadingDialogService,
        private userDetails: UserDetailsService
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let cloned = request.clone();
        if(this.userDetails.token && request.url.includes(environment.api)){
            cloned = request.clone({
                headers: request.headers.set('Authorization', this.userDetails.token)
            })
        }
        this.loadingDialogService.openDialog();
        return next.handle(cloned).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error("Error from error interceptor", error);
                alert(error.message ?? JSON.stringify(error))
                return throwError(error);
            }),
            finalize(() => {
                this.loadingDialogService.hideDialog();
            })
        ) as Observable<HttpEvent<any>>;
    }
}

import { 
    CallHandler, 
    ExecutionContext, 
    Injectable, 
    NestInterceptor 
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        // Gets the app name used for sending req and res
        const test  = context.switchToHttp().getRequest().headers['user-agent']
        
        return next
        .handle()
        .pipe(
            tap( (data) => {
                console.log(data)
            }),
            catchError( err => {
                console.log(`Error caught in interceptor, ${err}`)
                throw err;
            })
        );
    }
}
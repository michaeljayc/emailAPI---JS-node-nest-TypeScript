import { 
    CallHandler, 
    ExecutionContext, 
    Injectable, 
    NestInterceptor 
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { formatResponse } from "src/common/common.functions";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, 
        next: CallHandler<any>)
        : Observable<any> {
            
            // Gets the app name used for sending req and res
            const test  = context
                .switchToHttp().getRequest().headers['user-agent'];

            return next
            .handle()
            .pipe(
                tap( data => {
                    let obj_data = data.datas
                    if (obj_data && obj_data.length > 1) {
                        obj_data = obj_data.map( item => {
                            return item
                        }) 
                    } 
                    console.log( formatResponse
                        (obj_data, data.success, data.message) 
                    )
                }),
                catchError( err => {
                    console.log(`Error: ${err}`)
                    throw err;
                })
            );
    }
}
import { 
    CallHandler, 
    ExecutionContext, 
    Injectable, 
    NestInterceptor,
    Logger
} from "@nestjs/common";
import { Router } from "express";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { formatResponse } from "src/common/common.functions";
import { isAsyncFunction } from "util/types";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext,
        next: CallHandler<any>)
        : Observable<any> {

            const request = {
                "class": context.getClass().name,
                "function": context.getHandler().name,
                "params": context.getArgs()[0].params,
                "query": context.getArgs()[0].query,
            }   
           
            const log_path = context.getArgs()[0].path
            const logger = new Logger(log_path.toUpperCase());

            logger.log(`[REQUEST]: ${JSON.stringify(request)}`);
            return next
            .handle()
            .pipe(
                tap(
                    (res) => logger.log(`[RESPONSE]: ${JSON.stringify(res)}`),
                    (res) => {
                        logger.error(`[${log_path}]: ${JSON.stringify(res)}`);
                    }
                )
            )
            
        }
}
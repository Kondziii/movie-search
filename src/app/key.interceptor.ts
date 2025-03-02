import { HttpInterceptorFn } from "@angular/common/http";

export const keyInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    setParams: { apiKey: 'd69091cc' }
  });

  return next(clonedRequest);
};

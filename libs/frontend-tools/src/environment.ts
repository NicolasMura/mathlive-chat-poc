const apiPath = '/api';

export const environment = {
  production: (window as any).__env?.production || false,
  hmr: (window as any).__env?.hmr || false,
  wsEndpoint: (window as any).__env?.wsEndpoint || 'undefined',
  backendApi: {
    baseUrl:              (window as any).__env?.backendApi?.baseUrl || 'undefined',
    baseUrlUser:          (window as any).__env?.backendApi?.baseUrlUser || 'undefined',
    baseUrlMessage:          (window as any).__env?.backendApi?.baseUrlMessage || 'undefined',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

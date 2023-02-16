/**
 * @function cacheLogger
 * @description cacheLogger will add or update the evaluated log expression in a cache
 * 
 * If the variable is not a key in the cache, it will be added with its evaluated value.
 * If the variable is a key in the cache, it will be updated with its evaluated value.
 * 
 * @param {LogResult} res
 * @returns {LogResult} logCache - the updated cache
 */

 export type LogResult = {[variable: string]: string};

 export const cacheLogger = (res: LogResult): LogResult => {
     const logCache: LogResult = {};
     for (const key in res) {
         if (logCache[key] === undefined) {
             logCache[key] = res[key];
         } else if (logCache[key] !== res[key]) {
             logCache[key] = res[key];
         }
     }
     return logCache;
 };

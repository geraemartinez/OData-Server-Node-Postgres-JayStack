class DataBaseProxyHandler implements ProxyHandler<any> {

    get(target:any, name:string|number|symbol) {
        if (name !== 'query'){
            return target[name];
        }
        return function (...args: any) {
          return new Promise((resolve, reject) => {
            target.query(...args, (err: any, result: unknown) => {
              if (err){
                return reject(err);
              }else{
                resolve(result);
              }
            });
          });
        }
    }
}

export default DataBaseProxyHandler
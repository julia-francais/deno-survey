export const fileExists = async (filename: string):Promise<boolean> => {
  try {
        const statis = Deno.lstat(filename)
        return stats && statis.isFile;
  } catch(e) {
      if(e && e instanceof Deno.errors.NotFound){
          return false;
      } else {
          throw e;
      }
  }
}
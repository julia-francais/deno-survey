import { renderFileToString } from "https://deno.land/x/dejs@0.8.0/mod.ts";

export const renderView = (view: string, params: object = {}) => {
return renderFileToString(`${Deno.cwd()}/views/${view}.ejs`, params)
}

export const fileExists = async (filename: string):Promise<boolean> => {
  try {
        const stats = await Deno.stat(filename)
        return stats && stats.isFile;
  } catch(e) {
      if(e && e instanceof Deno.errors.NotFound){
        // file or directory does not exist
        return false;
      } else {
        // unexpected error, maybe permissions, pass it along
        throw e;
      }
  }
}

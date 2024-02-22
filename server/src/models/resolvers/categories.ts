import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { categorytype, categoryfiltertype } from "./types/categorytypes.js";

export const categoryResolvers = {
  Query: {
    listCategories: async (parent: undefined, filter: filtersorttype<categoryfiltertype>): Promise<categorytype[]> => {
      try {
        const allCategories: categorytype[] = await listAll<categorytype, categoryfiltertype>("categories", filter);
        return allCategories;
      } catch(err) {
        throw err;
      }
    },
    category: async (parent: undefined, { categoryname }: { categoryname: string }): Promise<categorytype> => {
      try {
        const categoryByName: categorytype = await findOne<categorytype, { categoryname: string }>("categories", { "categoryname": categoryname }); 

        if(!categoryByName) throw new Error(`category not found: ${categoryname}`);

        return categoryByName;
      } catch(err) {
        throw err;
      }
    }
  }
}

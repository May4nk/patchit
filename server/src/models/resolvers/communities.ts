import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { communitytype, communityfiltertype } from "./types/communitiestypes.js";
import { userscommunitytype } from "./types/userscommunitytypes.js";
import { usertype } from "./types/usertypes.js";
import { posttype } from "./types/posttypes.js";
import { categorytype } from "./types/categorytypes.js";

export const communityResolvers = {
  Query: {
    listCommunities: async (parent: undefined, filter?: filtersorttype<communityfiltertype>): Promise<communitytype[]> => {
      try { 
        const allCommunities: communitytype[] = await listAll<communitytype, communityfiltertype>("communities", filter);
        return allCommunities;
      } catch(err) {
        throw err;
      }
    },
    community: async (parent: undefined, { communityname }: { communityname: string }): Promise<communitytype> => {
      try {
        const communityByName: communitytype = await findOne<communitytype, { communityname: string}>("communities", { "communityname": communityname });

        if(!communityByName ) throw new Error(`Community not found with name: ${communityname}`);

        return communityByName;
      } catch(err) {
        throw err;
     }
    }
  },
  Community: {
    owner: async({ owner }: { owner: number }): Promise<usertype> => {
      try {
        const communityOwner: usertype = await findOne<usertype, { id: number }>("users", { "id": owner });
        return communityOwner;
      } catch (err) {
        throw err;
      }
    },
    category: async({ category }: { category: string }): Promise<categorytype> => {
      try {
        const communityCategory: categorytype = await findOne<categorytype, { categoryname: string }>("categories", { "categoryname": category });
        return communityCategory;
      } catch (err) {
        throw err;
      }
    },
    users: async({ id }: { id: number }): Promise<userscommunitytype[]> => {
      try{ 
        const allCommunityUsers: userscommunitytype[] = await listAll<userscommunitytype, { community_id: number }>("user_community_relation", { filter: { "community_id": id }});
        return allCommunityUsers;

      } catch(err) {
        throw err;
      }
    },
    posts: async({ id }: { id: number }): Promise<posttype[]> => {
      try {
        const allCommunityPosts: posttype[] = await listAll<posttype, { community_id: number }>("posts", { filter: { "community_id": id }});
        return allCommunityPosts;
      } catch (err) {
        throw err;
      }
    },
  },
}


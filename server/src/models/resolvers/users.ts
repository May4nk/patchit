import db from "../../db.js";
import { listAll, findOne, filtersorttype } from "../../common/queries.js";
import { usertype, userfiltertype } from "./types/usertypes.js";
import { userchatroomtype } from "./types/userchatroomtypes.js";
import { userscommunitytype } from "./types/userscommunitytypes.js";
import { userpreferencetype } from "./types/userpreferencetypes.js";
import { commenttype } from "./types/commenttypes.js";
import { communitytype } from "./types/communitiestypes.js";
import { savedposttype } from "./types/savedposttypes.js";
import { posttype } from "./types/posttypes.js";
import { roletype } from "./types/roletypes.js";
import { postlikedislikestype } from "./types/postlikedisliketypes.js";
import { tokentype } from "./types/tokentypes.js";

export const userResolvers = {
  Query: {
    listUsers: async (parent: undefined, filter?: filtersorttype<userfiltertype>): Promise<usertype[]> => {
      try {
        const alluserswithconstraints: usertype[] = await listAll<usertype, userfiltertype>("users", filter );
        return alluserswithconstraints;
      } catch(err) {
        throw err;
      }
    },
    user: async ( parent: undefined, { username }: { username: string } ): Promise<usertype> => {
      try {
        const userByUsername: usertype = await findOne<usertype, { username: string }>("users", { "username" : username });

        if(!userByUsername) throw new Error(`User not found with Username: ${ username }`);

        return userByUsername;
      } catch(err) {
        throw err;
      }
    }
  },
  User: {
    posts: async({ id }: { id: number }): Promise<posttype[]> => {
      try{ 
        const allUsersPosts: posttype[] = await listAll<posttype, { owner: number }>("posts", { filter: { "owner": id }});
        return allUsersPosts;
      } catch(err) {
        throw err;
      }
    },
    reactedposts: async({ id }: { id: number }): Promise<postlikedislikestype[]> => {
      try{ 
        const allUsersReaction: postlikedislikestype[] = await listAll<postlikedislikestype, { user_id: number }>("post_like_dislikes", { filter: { "user_id": id }});
        return allUsersReaction;
      } catch(err) {
        throw err;
      }
    },
    communities: async({ id }: { id: number }): Promise<userscommunitytype[]> => {
      try{ 
        const allUsersCommunity: userscommunitytype[] = await listAll<userscommunitytype, { user_id: number }>("user_community_relation", { filter: { "user_id": id }});
        return allUsersCommunity;
      } catch(err) {
        throw err;
      }
    },
    chatrooms: async({ id }: { id: number }): Promise<userchatroomtype[]> => {
      try { 
        const userRooms: userchatroomtype[] = await listAll<userchatroomtype, { user_id: number }>("user_chatrooms", { filter: { "user_id": id }});
        const allSpecificUserChatrooms: userchatroomtype[] = await db("user_chatrooms")
          .select("*")
          .havingIn("room_id", userRooms.map(({room_id})=> room_id))
          .groupBy("id")
          .orderBy([
            {
              "nulls": "last",
              "order": "desc",
              "column": "created_at"
            }
          ]);        

        return allSpecificUserChatrooms;
      } catch(err) {
        throw err;
      }      
    },
    comments: async({ id }: { id: number }): Promise<commenttype[]> => {
      try{ 
        const allUsersComments: commenttype[] = await listAll<commenttype, { user_id: number }>("comments", { filter: { "user_id": id }});
        return allUsersComments;
      } catch(err) {
        throw err;
      }
    },
    savedposts: async({ id }: { id: number }): Promise<savedposttype[]> => {
      try{ 
        const allUsersSavedPosts: savedposttype[] = await listAll<savedposttype, { user_id: number }>("saved", { filter: { "user_id": id }});
        return allUsersSavedPosts;
      } catch(err) {
        throw err;
      }
    },
    settings: async({ id }: { id: number }): Promise<userpreferencetype> => {
      try{ 
        const userSettings: userpreferencetype = await findOne<userpreferencetype, { user_id: number }>("user_preferences", { "user_id": id });
        return userSettings;
      } catch(err) {
        throw err;
      }
    },
    role: async({ role }: { role: number }): Promise<roletype> => { 
      try{ 
        const userRole: roletype = await findOne<roletype, { id: number }>("roles", { "id": role });
        return userRole;
      } catch(err) {
        throw err;
      }
    },
    ownedCommunities: async({ id }: { id: number }): Promise<communitytype[]> => {
      try{ 
        const allUserPatchers: communitytype[] = await listAll<communitytype, { owner: number }>("communities", { filter: { "owner": id }});
        return allUserPatchers;
      } catch(err) {
        throw err;
      }
    },
  }
}


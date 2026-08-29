import { RootState } from "@redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "types";
import { client } from "@utils/sanityClient";
import isInstanceOfError from "@utils/isInstanceOfError";

export type SearchUser = User & { city?: string };

export const searchUser = createAsyncThunk<
  SearchUser[],
  { searchTerm: string }
>("search/searchUser", async ({ searchTerm }, { getState }) => {
  const currentUserId = (getState() as RootState).auth.data._id;
  const term = searchTerm.trim().toLowerCase();
  if (!term) return [];

  try {
    const query = `*[_type == 'user' && _id != $currentUserId && (
        lower(name) match $term || lower(coalesce(city, "")) match $term
      )] | order(name asc) [0...20] {
        _id,
        name,
        city,
        isLoggedIn,
        'profileImage': profileImage.asset->url
      }`;
    return await client.fetch<SearchUser[]>(query, {
      currentUserId,
      term: `${term}*`,
    });
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error searching"));
  }
});

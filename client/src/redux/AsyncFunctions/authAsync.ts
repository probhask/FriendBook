import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types";
import { client } from "../../utils/sanityClient";
import { RootState } from "@redux/store";
import isInstanceOfError from "@utils/isInstanceOfError";

export const loginAuth = createAsyncThunk<
  User,
  { email: string; password: string }
>("auth/loginAuth", async ({ email, password }, thunkAPI) => {
  try {
    const query = `*[_type=='user' && (email=='${email}' && password=='${password}')]{
        _id,name,'profileImage':profileImage.asset->url}`;

    const sanityResult = await client.fetch<User[]>(query);
    if (sanityResult.length === 0) {
      return thunkAPI.rejectWithValue("no match data");
    }
    await client.patch(sanityResult[0]._id).set({ isLoggedIn: true }).commit();

    return { ...sanityResult[0], isLoggedIn: true };
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error login "));
  }
});

export const logout = createAsyncThunk<boolean>(
  "auth/logout",
  async (_, { getState }) => {
    const userId = (getState() as RootState).auth.data._id;
    try {
      await client.patch(userId).set({ isLoggedIn: false }).commit();
      return false;
    } catch (error) {
      throw new Error(isInstanceOfError(error, "error logout"));
    }
  }
);

export const createUser = createAsyncThunk<
  User,
  { email: string; password: string; name: string }
>("auth/createUser", async ({ name, email, password }) => {
  try {
    const newUserDoc = {
      _type: "user",
      name,
      email,
      password,
      isLoggedIn: true,
    };

    const newUser = await client.create(newUserDoc);

    return {
      _id: newUser._id,
      name: newUser.name,
      profileImage: "",
      isLoggedIn: newUser.isLoggedIn,
    };
  } catch (error) {
    throw new Error(isInstanceOfError(error, "error creating user"));
  }
});

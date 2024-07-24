export const checkLocalStorage = (key?: string) => {
  if (localStorage.getItem("friendBook")) {
    let ls;
    if (key) {
      ls = JSON.parse(localStorage.getItem("friendBook") as string)[key];
    } else {
      ls = JSON.parse(localStorage.getItem("friendBook") as string);
    }
    // console.log(key,ls);
    if (ls) {
      return ls;
    } else {
      return false;
    }
  } else {
    if (!key) {
      return undefined;
    } else {
      return false;
    }
  }
};

import { InputField, PasswordField } from "../components";
import { TfiEmail } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../redux/hooks/storeHook";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { loginAuth } from "../redux/AsyncFunctions/authAsync";
import { getAuthLoading } from "@redux/slice/authSlice";

const SIGNIN_IMG = "/sign_in.webp";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authLoading = useAppSelector(getAuthLoading);
  const loginFormik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .trim()
        .min(13, "Must conatin min 13 characters")
        .required("Required"),
      password: Yup.string()
        .trim()
        .min(6, "Must conatin min 6 characters")
        .max(12, "Must be 12 characters or less")
        .required(),
    }),

    onSubmit: (values) => {
      dispatch(
        loginAuth({ email: values.email, password: values.password })
      ).then(() => navigate("/"));
    },
  });

  // useEffect(() => {
  //   if (isLoggedIn && !authLoading) {
  //     navigate("/", { replace: true });
  //   }
  // }, [isLoggedIn]);
  return (
    <div className="w-full h-full ">
      <div className="flex justify-evenly items-start h-full mt-5 px-3 sm:px-5 md:px-10 ">
        <div className=" hidden md:flex justify-center w-full h-full">
          <div className="h-full mt-8">
            <img src={SIGNIN_IMG} className="min-w-full min-h-full" />
          </div>
        </div>

        <div className="flex flex-col gap-y-5 px-1 w-full">
          {/* login regostor tab button */}

          <div className="self-end flex gap-x-4">
            <button
              className="px-2 py-1 bg-black text-white rounded-lg mt-2 text-xs w-20 h-7 font-semibold hover:shadow-md"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="px-2 py-1 bg-blue-600 text-white rounded-lg mt-2 text-xs w-20 h-7 font-semibold hover:shadow-md"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>

          <div className="flex justify-center mt-8 w-full">
            <div className="flex flex-col gap-y-3 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[75%]">
              {/* heading */}
              <div className="mb-2">
                <h1 className="font-bold text-2xl text-slate-800/90">
                  Login into your account
                </h1>
              </div>
              <form
                className="flex flex-col gap-y-3"
                onSubmit={loginFormik.handleSubmit}
              >
                {/* input field */}
                <div className="flex flex-col gap-y-3">
                  <InputField
                    name="email"
                    value={loginFormik.values.email}
                    onchange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    placeHolder="Your Email Address"
                    icon={<TfiEmail />}
                    error={
                      loginFormik.touched.email ? loginFormik.errors.email : ""
                    }
                  />

                  <PasswordField
                    name="password"
                    value={loginFormik.values.password}
                    onchange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    placeHolder="Password"
                    error={
                      loginFormik.touched.password
                        ? loginFormik.errors.password
                        : ""
                    }
                  />
                </div>
                {/* forget password */}

                {/* login button */}
                <button
                  type="submit"
                  className="w-full text-center py-1 h-10 rounded-md hover:shadow-md bg-black text-white font-semibold text-sm flex justify-center items-center gap-x-2"
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <span className="font-bold text-lg animate-spin">
                      <AiOutlineLoading3Quarters />
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              {/* some other */}
              <div className="flex flex-col gap-y-4 text-sm font-normal text-gray-400">
                <p className="">
                  Don't have account{" "}
                  <span
                    className="text-blue-600 px-1 font-semibold cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </span>
                </p>

                {/* <p className="text-center">
                  or, Sign in with your social account
                </p> */}
              </div>

              {/* social icon button */}
              {/* <div className="flex flex-col gap-y-2">
                <button className="flex items-center text-sm font-semibold text-white bg-blue-600 w-full h-10 px-1 py-1 rounded-md hover:shadow-md">
                  <div className=" px-1 bg-white h-full rounded-md flex justify-center items-center text-2xl">
                    <FcGoogle />
                  </div>
                  <p className="w-full text-center">Sign in with Google</p>
                </button>

                <button className="flex items-center text-sm font-semibold text-white bg-blue-900 w-full h-10 px-1 py-1 rounded-md hovaer:shadow-md">
                  <div className=" px-1 bg-white text-blue-600 h-full rounded-md flex justify-center items-center text-2xl">
                    <BsFacebook />
                  </div>
                  <p className="w-full text-center">Sign in with Google</p>
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { InputField, PasswordField } from "../components";
import { TfiEmail } from "react-icons/tfi";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "@redux/hooks/storeHook";
import { createUser } from "@redux/AsyncFunctions/authAsync";
import { getAuthLoading } from "@redux/slice/authSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SIGNIN_IMG = "/sign_in.webp";

const Register = () => {
  const authLoading = useAppSelector(getAuthLoading);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const registerFormik = useFormik({
    initialValues: { name: "", email: "", password: "", confirm_Password: "" },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(5, "Must conatin min 5 characters")
        .max(15, "Must be 15 characters or less")
        .required(),
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
      confirm_Password: Yup.string()
        .trim()
        .required()
        .oneOf([Yup.ref("password")], "Password must match"),
    }),

    onSubmit: (values) => {
      dispatch(
        createUser({
          email: values.email,
          password: values.password,
          name: values.name,
        })
      ).then(() => navigate("/"));
    },
  });
  // useEffect(() => {
  //   if (isLoggedIn && !authLoading) {
  //     navigate("/", { replace: true });
  //   }
  // }, [isLoggedIn]);

  return (
    <div className="w-full h-full">
      <div className="flex justify-evenly items-start mt-5 px-3 sm:px-5 md:px-10 h-full">
        <div className="hidden md:flex justify-center w-full h-full">
          <div className="h-full">
            <img src={SIGNIN_IMG} className="min-w-full min-h-full" />
          </div>
        </div>

        <div className="flex flex-col gap-y-5 px-1 w-full">
          {/* login regostor tab button */}
          <div className="self-end flex gap-x-4">
            <button
              className="px-2 py-1 bg-black text-white rounded-lg mt-2 text-xs h-7 w-20 font-semibold hover:shadow-md"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="px-2 py-1 bg-blue-600 text-white rounded-lg mt-2 text-xs h-7 w-20 font-semibold hover:shadow-md"
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
                  Create your account
                </h1>
              </div>
              <form
                className="flex flex-col gap-y-3"
                onSubmit={registerFormik.handleSubmit}
              >
                {/* input field */}
                <div className="flex flex-col gap-y-3">
                  <InputField
                    name="name"
                    value={registerFormik.values.name}
                    onchange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    placeHolder="Your Name"
                    icon={<IoPersonOutline />}
                    error={
                      registerFormik.touched.name
                        ? registerFormik.errors.name
                        : ""
                    }
                  />
                  <InputField
                    name="email"
                    value={registerFormik.values.email}
                    onchange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    placeHolder="Your Email Address"
                    icon={<TfiEmail />}
                    error={
                      registerFormik.touched.email
                        ? registerFormik.errors.email
                        : ""
                    }
                  />
                  <PasswordField
                    name="password"
                    value={registerFormik.values.password}
                    onchange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    placeHolder="Password"
                    error={
                      registerFormik.touched.password
                        ? registerFormik.errors.password
                        : ""
                    }
                  />
                  <PasswordField
                    name="confirm_Password"
                    value={registerFormik.values.confirm_Password}
                    onchange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                    placeHolder="Confirm Password"
                    error={
                      registerFormik.touched.confirm_Password
                        ? registerFormik.errors.confirm_Password
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
                    "Register"
                  )}
                </button>
              </form>

              {/* some other */}
              <div className="flex flex-col gap-y-4 text-sm font-normal text-gray-400">
                <p className="">
                  Already have account{" "}
                  <span
                    className="text-blue-600 px-1 font-semibold cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </span>
                </p>
                {/* 
                <p className="text-center">
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

                <button className="flex items-center text-sm font-semibold text-white bg-blue-900 w-full h-10 px-1 py-1 rounded-md hover:shadow-md">
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

export default Register;

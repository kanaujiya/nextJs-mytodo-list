import React, { useState,useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { useAuth } from "@/firebase/auth";
import Link from "next/link";

const RegisterForm = () => {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const { authUser, isLoading, setAuthUser } = useAuth();
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/");
    }
  }, [authUser, isLoading]);

  const signupHandler = async () => {
    if (!username || !email || !password) return;
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName: username });
      setAuthUser({ uid: user.uid, email: user.email, username });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const signWithGoogle = async () => {
    try {
      const googlelogin = await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading || (!isLoading && authUser) ? (
    <Loader />
  ) : (
    <main className="flex lg:h-[120vh]">
      <div className="w-full lg:w-[60%] p-9 md:p-12 flex items-center justify-center lg:justify-start">
        <div className="p-8 w-[600px]">
          <h1 className="text-6xl font-semibold text-white">Sign Up</h1>
          <p className="mt-6 ml-1 text-white">
            Already have an account ?{" "}
            <Link href={"/login"} className="underline hover:text-blue-400 cursor-pointer">
              Login
            </Link>
          </p>

          <div
            onClick={signWithGoogle}
            className="bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
          >
            <FcGoogle size={22} />
            <span className="font-medium text-white">
              Login with Google
            </span>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mt-10 pl-1 flex flex-col">
              <label className="text-white">Name</label>
              <input
                type="text"
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                placeholder="Enter your name"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mt-10 pl-1 flex flex-col">
              <label className="text-white">Email</label>
              <input
                type="email"
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                placeholder="Enter your email."
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-10 pl-1 flex flex-col">
              <label className="text-white">Password</label>
              <input
                type="password"
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                placeholder="Enter your password."
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              onClick={signupHandler}
              className="bg-black text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div
        className="w-[40%] bg-slate-400 bg-cover bg-right-top hidden lg:block"
        style={{
          backgroundImage: "url('/img1.jpeg')",
        }}
      ></div>
    </main>
  );
};

export default RegisterForm;

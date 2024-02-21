import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever, MdCreate } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { useAuth } from "@/firebase/auth";

import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

export default function Home() {
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [inputError, setInputError] = useState("");
  const [actionType, setActionType] = useState("add");
  const [documentId, setDocumentId] = useState('');
  const [show, setShow] = useState(false);
  const { authUser, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/login");
    }
    if (!!authUser?.uid) {
      fetchTodos(authUser.uid);
    }
  }, [authUser, isLoading]);

  const addTodos = async () => {
    if (actionType === "edit") {
      try {
        await updateDoc(doc(db, "tooodooo", documentId), {
          content: todoInput,
        });
        fetchTodos(authUser.uid);
        setActionType("add");
        setDocumentId('');
        setTodoInput("");
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        if (todoInput.length > 0) {
          setInputError("");
          const docRef = await addDoc(collection(db, "tooodooo"), {
            owner: authUser.uid,
            content: todoInput,
            completed: false,
          });
          fetchTodos(authUser.uid);
          setTodoInput("");
        } else {
          setInputError("Please enter your task.");
        }
      } catch (error) {
        console.log(error);
      }
    }

  };

  const fetchTodos = async (uid) => {
    try {
      const q = query(
        collection(db, "tooodooo"),
        where("owner", "==", authUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setTodos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (docId) => {
    try {
      await deleteDoc(doc(db, "tooodooo", docId));
      fetchTodos(authUser.uid);
    } catch (error) {
      console.log(error);
    }
  };

  const markAsCompleted = async (e, docId) => {
    try {
      await updateDoc(doc(db, "tooodooo", docId), {
        completed: e.target.checked,
      });
      fetchTodos(authUser.uid);
    } catch (error) {
      console.log(error);
    }
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter" && todoInput.length > 0) {
      addTodos();
    }
  };

  const selectAll = async (status) => {
    try {
      setShow(status);
      todos.map((todo) => {
        updateDoc(doc(db, "tooodooo", todo.id), {
          completed: status,
        });
        fetchTodos(authUser.uid);
      })
    } catch (error) {
      console.log(error);
    }

  };

  const delectAll = async () => {
    try {
      todos.forEach((todo) => {
        try {
          deleteDoc(doc(db, "tooodooo", todo.id));
          fetchTodos(authUser.uid);
        } catch (error) {
          console.log(error);
        }
      })
      setShow(false);
    } catch (error) {
      console.log(error)
    }

  };


  return !authUser ? (
    <Loader />
  ) : (
    <main className="">
      <div
        onClick={signOut}
        className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
      >
        <GoSignOut size={18} />
        <span>Logout</span>
      </div>
      <div className="max-w-3xl mx-auto mt-10 p-8">
        <div className="bg-[#013220] -m-6 p-3 sticky top-0">
          <div className="flex justify-center flex-col items-center">
            <span className="text-7xl mb-10">📝</span>
            <h1 className="text-5xl md:text-7xl font-bold text-white">My Todo's List</h1>
          </div>
          <div className="flex items-center gap-2 mt-10">
            <input
              placeholder={`👋 Hello ${authUser.username}, What to do Today?`}
              type="text"
              className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
              autoFocus
              value={todoInput}
              onChange={(e) => {
                setTodoInput(e.target.value), setInputError("");
              }}
              onKeyUp={onKeyUp}
            />

            <button
              onClick={() => addTodos()}
              className="w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]"
            >
              <AiOutlinePlus size={30} color="#fff" />
            </button>
          </div>
          <span>{inputError}</span>
          <div className="flex gap-3">
            {(!show && todos.length > 0) && <button onClick={() => selectAll(true)} className="bg-black text-white w-44 py-4 mt-5 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90">Select All</button>}
            {show && <><button onClick={() => selectAll(false)} className="bg-black text-white w-44 py-4 mt-5 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90">Unselect All</button>
              <button onClick={delectAll} className="bg-black text-white w-44 py-4 mt-5 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90">Delete All</button>
            </>}
          </div>
        </div>

        <div className="my-10 ">
          {todos.length > 0 &&
            todos.map((todo, index) => (
              <div
                className="flex items-center justify-between mt-4"
                key={todo.id}
              >
                <div className="flex items-center gap-3">
                  <input
                    id={`todo-${todo.id}`}
                    type="checkbox"
                    className="w-4 h-4 accent-green-400 rounded-lg"
                    checked={todo.completed}
                    onChange={(e) => markAsCompleted(e, todo.id)}
                  />
                  <label
                    htmlFor={`todo-${index}`}
                    className={`font-medium text-white ${todo.completed ? "line-through" : ""
                      }`}
                  >
                    {todo.content}
                  </label>
                </div>
                <div className="flex item-center justify-center gap-2">
                  {!todo.completed && <div className="flex items-center gap-3">
                    <MdCreate
                      size={24}
                      className="text-green-400 cursor-pointer"
                      onClick={(e) => { setTodoInput(todo.content); setActionType('edit'); setDocumentId(todo.id) }}
                    />
                  </div>}
                  {todo.completed && (
                    <div className="flex items-center gap-3">
                      <MdDeleteForever
                        size={24}
                        className="text-red-400 hover:text-red-600 cursor-pointer"
                        onClick={() => deleteTodo(todo.id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

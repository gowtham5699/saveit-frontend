import { useAuth } from "@/auth/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-sm mx-auto"> 
      <h1 className="text-xl mb-4">Login</h1>
      <input 
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        className="border p-2 w-full mb-4"
        type="password" 
        placeholder="Password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button className="w-full bg-black text-white p-2">Login</button>
    </form>
  )
}
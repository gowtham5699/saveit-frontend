import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({
      ...form,
      phone: form.phone || undefined,
    });
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 max-w-sm mx-auto">
      <h1 className="text-xl mb-4">Register</h1>

      {Object.entries(form).map(([key, value]) => (
        <input
          key={key}
          className="border p-2 w-full mb-2"
          placeholder={key.replace("_", " ")}
          value={value}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ))}

      <button className="w-full bg-black text-white p-2">Create Account</button>
    </form>
  );
}

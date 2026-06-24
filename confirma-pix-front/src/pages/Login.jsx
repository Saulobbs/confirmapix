import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErro(data.erro || "Erro ao fazer login");
        return;
      }

      // SALVA TOKEN
      localStorage.setItem("token", data.token);

      // SALVA USUÁRIO
      localStorage.setItem(
        "usuario",
        JSON.stringify(data.usuario)
      );

      navigate("/dashboard");
    } catch (error) {
      setErro("Erro de conexão");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1020]">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Entrar
        </h1>

        <p className="text-gray-400 mb-6">
          Acesse sua conta ConfirmaPix
        </p>

        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-white/10 text-white"
        />

        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-white/10 text-white"
        />

        {erro && (
          <p className="text-red-500 mb-4">
            {erro}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-green-400 text-black font-bold py-3 rounded-xl"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
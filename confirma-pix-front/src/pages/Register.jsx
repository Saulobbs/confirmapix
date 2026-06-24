import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function cadastrar(e) {

    e.preventDefault();

    setErro("");
    setSucesso("");
    setLoading(true);

    try {

      const response = await fetch(
        "/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nome,
            email,
            senha
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.erro || "Erro ao cadastrar"
        );
      }

      setSucesso(
        "Cadastro realizado com sucesso!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      setErro(err.message);

    } finally {

      setLoading(false);

    }

  }

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-[#0d111d] border border-white/10 rounded-3xl p-8">

        <h1 className="text-4xl font-black text-white mb-2">
          Criar conta
        </h1>

        <p className="text-gray-400 mb-8">
          Teste grátis por 30 dias
        </p>

        <form
          onSubmit={cadastrar}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white"
          />

          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white"
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white"
          />

          {erro && (
            <div className="text-red-400 text-sm">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="text-green-400 text-sm">
              {sucesso}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-xl bg-green-400 text-black font-bold"
          >
            {loading
              ? "Criando conta..."
              : "Criar conta"}
          </button>

        </form>

      </div>

    </div>
  );

}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();
const [mostrarApi, setMostrarApi] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");   

  const [stats, setStats] = useState({
    pagamentosHoje: 0,
    pixConfirmados: 0,
    pixPendentes: 0,
    totalRecebido: 0,
    registrosTotais: 0,
    ultimasTransacoes: []
  });

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const dadosUsuario =
      localStorage.getItem("usuario");

    if (dadosUsuario) {
      setUsuario(JSON.parse(dadosUsuario));
    }

    carregarStats();

  }, []);

async function salvarConfiguracao() {

  try {

    const response = await fetch(
      "http://localhost:3000/auth/config",
      {
        method: "PUT",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`
},
       body: JSON.stringify({
        apiKey,
        webhookUrl
     })
      }
    );

    const data = await response.json();

    console.log("CONFIG SALVA:", data);
    //alert(JSON.stringify(data));


    if (data.usuario) {

      localStorage.setItem(
        "usuario",
        JSON.stringify(data.usuario)
      );

      setUsuario(data.usuario);

      alert("Configuração salva!");

    }

  } catch (err) {

    console.error(err);

    alert("Erro ao salvar");

  }

}

  async function carregarStats() {
    

    try {

      console.log("USUARIO ATUAL:", usuario);
      const response = await fetch(
        "http://127.0.0.1:3000/dashboard/stats"
      );

      const data = await response.json();

      console.log("STATS:", data);

      setStats(data);

    } catch (err) {

      console.log("ERRO:", err);

    }

  }

  async function assinarPro() {

  try {

    const response = await fetch(
      "http://localhost:3000/assinatura/pix",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: usuario.id
        })
      }
    );

    const data = await response.json();

    console.log("RESPOSTA:", data);

alert(JSON.stringify(data));

    console.log(data);

    if (!data.sucesso) {

      alert("Erro ao gerar PIX");

      return;
    }

    localStorage.setItem(
      "assinaturaPix",
      JSON.stringify(data)
    );

    window.location.href = "/assinatura";


  } catch (err) {

    console.error(err);

    alert("Erro ao gerar assinatura");

  }

}
  

  function sair() {

    localStorage.removeItem("token");

    localStorage.removeItem("usuario");

    navigate("/login");

  }

  if (!usuario) {

    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        Carregando...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-[#050816] text-white p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-5xl font-black">
              Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Bem-vindo ao ConfirmaPix
            </p>

          </div>

          <button
            onClick={sair}
            className="px-5 py-3 rounded-xl bg-red-500 font-bold"
          >
            Sair
          </button>

        </div>

        {/* ESTATÍSTICAS */}

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">

          <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-6">

            <p className="text-gray-400">
              Pagamentos Hoje
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {stats.pagamentosHoje}
            </h3>

          </div>

          <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-6">

            <p className="text-gray-400">
              PIX Confirmados
            </p>

            <h3 className="text-3xl font-bold mt-2 text-green-400">
              {stats.pixConfirmados}
            </h3>

          </div>

          <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-6">

            <p className="text-gray-400">
              PIX Pendentes
            </p>

            <h3 className="text-3xl font-bold mt-2 text-yellow-400">
              {stats.pixPendentes}
            </h3>

          </div>

          <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-6">

            <p className="text-gray-400">
              Total Recebido
            </p>

            <h3 className="text-3xl font-bold mt-2 text-green-400">
              R$ {Number(stats.totalRecebido).toFixed(2)}
            </h3>

          </div>

          <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-6">

            <p className="text-gray-400">
              Registros Totais
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {stats.registrosTotais}
            </h3>

          </div>

        </div>

        {/* DADOS DO CLIENTE */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-6">

            <p className="text-gray-400">
              Nome
            </p>

            <h3 className="text-2xl font-bold mt-2">
              {usuario.nome}
            </h3>

          </div>

          <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-6">

            <p className="text-gray-400">
              Email
            </p>

            <h3 className="text-lg font-bold mt-2 break-all">
              {usuario.email}
            </h3>

          </div>

          <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-6">

            <p className="text-gray-400">
              Plano
            </p>

            <h3 className="text-2xl font-bold mt-2 text-green-400">
              {usuario.plano}
            </h3>

          </div>

          <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-6">

            <p className="text-gray-400">
              Status
            </p>

            <h3 className="text-2xl font-bold mt-2 text-green-400">
              {usuario.statusAssinatura || "Ativo"}
            </h3>

          </div>

        </div>

        <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-6 mb-10">

  <h2 className="text-2xl font-bold mb-4">
    Assinatura
  </h2>

  <p className="text-gray-400">
    Plano atual
  </p>

  <h3 className="text-3xl font-bold mt-2">
    {usuario.plano === "pro"
      ? "PRO"
      : "TESTE"}
  </h3>

  <p className="mt-4 text-gray-400">
    Valor mensal
  </p>

  <h3 className="text-2xl font-bold text-green-400">
    R$ 19,90
  </h3>

  {usuario.plano !== "pro" && (

   <button
  className="mt-6 bg-green-600 px-6 py-3 rounded-xl font-bold"
  onClick={assinarPro}
>
  Assinar PRO
</button>

  )}

</div>

        {/* ÚLTIMAS TRANSAÇÕES */}

        <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            Últimas Transações
          </h2>

          <div className="flex gap-3 mb-6">

  <button
    onClick={() => setFiltroStatus("todos")}
    className={`px-4 py-2 rounded-xl ${
      filtroStatus === "todos"
        ? "bg-blue-600"
        : "bg-gray-700"
    }`}
  >
    Todos
  </button>

  <button
    onClick={() => setFiltroStatus("aprovado")}
    className={`px-4 py-2 rounded-xl ${
      filtroStatus === "aprovado"
        ? "bg-green-600"
        : "bg-gray-700"
    }`}
  >
    Aprovados
  </button>

  <button
    onClick={() => setFiltroStatus("pendente")}
    className={`px-4 py-2 rounded-xl ${
      filtroStatus === "pendente"
        ? "bg-yellow-600"
        : "bg-gray-700"
    }`}
  >
    Pendentes
  </button>

</div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-white/10 text-gray-400">

                  <th className="text-left py-3">
                    Valor
                  </th>

                  <th className="text-left py-3">
                    Status
                  </th>

                  <th className="text-left py-3">
                    Email
                  </th>

                  <th className="text-left py-3">
                    Data
                  </th>

                </tr>

              </thead>

              <tbody>

                {stats.ultimasTransacoes
  ?.filter((item) => {

    if (filtroStatus === "todos")
      return true;

    return item.status === filtroStatus;

  })
  .map((item) => (

                  <tr
                    key={item._id}
                    className="border-b border-white/5"
                  >

                    <td className="py-4">
                      R$ {Number(item.valor || 0).toFixed(2)}
                    </td>

                    <td className="py-4">

                      <span
                        className={
                          item.status === "aprovado"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        {item.status}
                      </span>

                    </td>

                    <td className="py-4">
                      {item.email}
                    </td>

                    <td className="py-4">
                      {new Date(
                        item.criadoEm
                      ).toLocaleString("pt-BR")}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            <div className="grid md:grid-cols-3 gap-6 mt-8">

  <div className="bg-[#050816] border border-white/10 rounded-2xl p-5">

    <h3 className="font-bold text-lg mb-3">
      Taxa de Conversão
    </h3>

    <p>PIX Gerados: {stats.registrosTotais}</p>

    <p>PIX Pagos: {stats.pixConfirmados}</p>

    <p className="text-green-400 font-bold mt-2">
      Conversão:
      {" "}
      {stats.registrosTotais
        ? (
            (stats.pixConfirmados /
              stats.registrosTotais) *
            100
          ).toFixed(2)
        : 0}
      %
    </p>

  </div>

  <div className="bg-[#050816] border border-white/10 rounded-2xl p-5">

    <h3 className="font-bold text-lg mb-3">
      Status da Integração
    </h3>

    <p className="text-green-400 font-bold">
      🟢 Mercado Pago Conectado
    </p>

  </div>

  <div className="bg-[#050816] border border-white/10 rounded-2xl p-5">

<div className="bg-[#050816] border border-white/10 rounded-2xl p-5 mb-6">

  <h3 className="font-bold text-lg mb-4">
    Configuração Mercado Pago
  </h3>

 <div className="flex gap-2">
  <input
    type={mostrarApi ? "text" : "password"}
    value={apiKey}
    onChange={(e) => setApiKey(e.target.value)}
    className="flex-1"
  />


</div>

  <input
    type="text"
    placeholder="Webhook URL"
    value={webhookUrl}
    onChange={(e) => setWebhookUrl(e.target.value)}
    className="w-full p-3 rounded-xl bg-[#0d111d] mb-4"
  />

  <button
    onClick={salvarConfiguracao}
    className="bg-green-600 px-5 py-3 rounded-xl font-bold"
  >
    Salvar Configuração
  </button>

</div>

    <h3 className="font-bold text-lg mb-3">
      API Key
    </h3>

    <div className="flex justify-between items-center">

     <p>
  {mostrarApi
    ? usuario?.apiKey
    : "••••••••••••••••"}
</p>

<button
  className="bg-blue-600 px-3 py-1 rounded-lg"
  onClick={() =>
    navigator.clipboard.writeText(
      usuario?.apiKey || ""
    )
  }
>
  Copiar
</button>

<button
  className="bg-gray-600 px-3 py-1 rounded-lg ml-2"
  onClick={() =>
    setMostrarApi(!mostrarApi)
  }
>
  {mostrarApi ? "Ocultar" : "Mostrar"}
</button>

    </div>

  </div>

</div>

<div className="bg-[#050816] border border-white/10 rounded-2xl p-5 mt-6">

  <h3 className="font-bold text-lg mb-3">
    Webhook URL
  </h3>

  <div className="flex justify-between items-center">

    <span>
  {usuario.webhookUrl || "Não configurada"}
</span>

<button
  className="bg-blue-600 px-3 py-1 rounded-lg"
  onClick={() =>
    navigator.clipboard.writeText(
      usuario.webhookUrl || ""
    )
  }
>
  Copiar
</button>

  </div>

</div>

          </div>

        </div>

      </div>

    </div>

  );

}
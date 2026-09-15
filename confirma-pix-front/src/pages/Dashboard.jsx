import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ativarNotificacoes,
  desativarNotificacoes
} from "../pushNotifications";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {

  const [notificacoesAtivas, setNotificacoesAtivas] =
  useState(
    typeof Notification !== "undefined" &&
    Notification.permission === "granted"
  );

const [carregandoNotificacoes, setCarregandoNotificacoes] =
  useState(false);

async function ativarPush() {
  try {
    setCarregandoNotificacoes(true);

    const resultado = await ativarNotificacoes();

    if (resultado?.sucesso) {
      setNotificacoesAtivas(true);
    }

  } catch (error) {
    console.error(
      "Erro ao ativar notificações:",
      error
    );

    alert(
      error?.message ||
      "Não foi possível ativar as notificações."
    );

  } finally {
    setCarregandoNotificacoes(false);
  }
}

async function desativarPush() {
  try {
    setCarregandoNotificacoes(true);

    const resultado = await desativarNotificacoes();

    if (resultado?.sucesso) {
      setNotificacoesAtivas(false);
    }

  } catch (error) {
    console.error(
      "Erro ao desativar notificações:",
      error
    );

  } finally {
    setCarregandoNotificacoes(false);
  }
}

  const navigate = useNavigate();

  const [mostrarApi, setMostrarApi] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [nomeLoja, setNomeLoja] = useState("");
  const [slugLoja, setSlugLoja] = useState("");

  const [filtroStatus, setFiltroStatus] = useState("todos");

  const [stats, setStats] = useState({
    pagamentosHoje: 0,
    pixConfirmados: 0,
    pixPendentes: 0,
    totalRecebido: 0,
    registrosTotais: 0,
    ultimasTransacoes: []
  });

  // TRANSFORMA O NOME DA LOJA EM SLUG
  function gerarSlug(nome) {

    return nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "");

  }

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const dadosUsuario =
      localStorage.getItem("usuario");

    if (dadosUsuario) {

      const dados = JSON.parse(dadosUsuario);

      setUsuario(dados);

      setApiKey(dados.apiKey || "");
      setWebhookUrl(dados.webhookUrl || "");
      setNomeLoja(dados.nomeLoja || "");
      setSlugLoja(
        dados.slugLoja ||
        gerarSlug(dados.nomeLoja || "")
      );

    }

    carregarStats();

  }, []);

  async function salvarConfiguracao() {

    try {

      const response = await fetch(
        `${API_URL}/auth/config`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          },

          body: JSON.stringify({

            apiKey,
            webhookUrl,
            nomeLoja,
            slugLoja

          })
        }
      );

      const data = await response.json();

      console.log("CONFIG SALVA:", data);

      if (!response.ok) {

        alert(data.erro || "Erro ao salvar configuração");
        return;

      }

      if (data.usuario) {

        localStorage.setItem(
          "usuario",
          JSON.stringify(data.usuario)
        );

        setUsuario(data.usuario);

        setApiKey(data.usuario.apiKey || "");
        setWebhookUrl(data.usuario.webhookUrl || "");
        setNomeLoja(data.usuario.nomeLoja || "");
        setSlugLoja(data.usuario.slugLoja || "");

        alert("Configuração salva!");

      }

    } catch (err) {

      console.error(err);

      alert("Erro ao salvar");

    }

  }

  async function carregarStats() {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
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
        `${API_URL}/assinatura/pix`,
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

        {/* ASSINATURA */}

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

              {/* TAXA DE CONVERSÃO */}

              <div className="bg-[#050816] border border-white/10 rounded-2xl p-5">

                <h3 className="font-bold text-lg mb-3">
                  Taxa de Conversão
                </h3>

                <p>
                  PIX Gerados: {stats.registrosTotais}
                </p>

                <p>
                  PIX Pagos: {stats.pixConfirmados}
                </p>

                <p className="text-green-400 font-bold mt-2">

                  Conversão{" "}

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

              {/* STATUS DA INTEGRAÇÃO */}

              <div className="bg-[#050816] border border-white/10 rounded-2xl p-5">

                <h3 className="font-bold text-lg mb-3">
                  Status da Integração
                </h3>

                <div className="flex items-center gap-2 mt-5">

                  <div className="w-3 h-3 rounded-full bg-green-500"></div>

                  <span className="text-green-400 font-bold">
                    Mercado Pago Conectado
                  </span>

                </div>

              </div>

              {/* CONFIGURAÇÃO MERCADO PAGO */}

              <div className="bg-[#050816] border border-white/10 rounded-2xl p-5">

                <h3 className="font-bold text-lg mb-4">
                  Configuração Mercado Pago
                </h3>

                <label className="block text-sm font-bold mb-1">
                  Nome da Loja
                </label>

                <input
                  type="text"
                  value={nomeLoja}
                  onChange={(e) => {

                    const nome = e.target.value;

                    setNomeLoja(nome);

                    // ATUALIZA O SLUG NA HORA
                    setSlugLoja(gerarSlug(nome));

                  }}
                  className="w-full p-2 rounded-lg bg-[#0d111d] mb-3"
                  placeholder="Nome da loja"
                />

                <label className="block text-sm font-bold mb-1">
                  Sua Página PIX
                </label>

                <div className="bg-[#0d111d] rounded-lg p-2 text-xs break-all mb-2">

                  https://confirmapix.onrender.com/
                  {slugLoja || "sualoja"}

                </div>

                <div className="flex gap-2 mb-3">

                  <button
                    type="button"
                    className="flex-1 bg-blue-600 py-2 rounded-lg text-xs font-bold"
                    onClick={() => {

                      if (!slugLoja) {
                        alert("Digite o nome da loja primeiro");
                        return;
                      }

                      window.open(
                        `https://confirmapix.onrender.com/${slugLoja}`,
                        "_blank"
                      );

                    }}
                  >
                    🌐 Abrir Página
                  </button>

                  <button
                    type="button"
                    className="flex-1 bg-gray-700 py-2 rounded-lg text-xs font-bold"
                    onClick={() => {

                      if (!slugLoja) {
                        alert("Digite o nome da loja primeiro");
                        return;
                      }

                      navigator.clipboard.writeText(
                        `https://confirmapix.onrender.com/${slugLoja}`
                      );

                      alert("Link copiado!");

                    }}
                  >
                    📋 Copiar Link
                  </button>

                </div>

                <label className="block text-sm font-bold mb-1">
                  API Key Mercado Pago
                </label>

                <div className="flex gap-2 mb-3">

                  <input
                    type={
                      mostrarApi
                        ? "text"
                        : "password"
                    }
                    value={apiKey}
                    onChange={(e) =>
                      setApiKey(e.target.value)
                    }
                    className="flex-1 p-2 rounded-lg bg-[#0d111d]"
                    placeholder="Cole sua API Key"
                  />

                  <button
                    type="button"
                    className="bg-gray-700 px-3 rounded-lg text-xs"
                    onClick={() =>
                      setMostrarApi(!mostrarApi)
                    }
                  >
                    {mostrarApi
                      ? "Ocultar"
                      : "Mostrar"}
                  </button>

                  <button
                    type="button"
                    className="bg-blue-600 px-3 rounded-lg text-xs"
                    onClick={() => {

                      if (!apiKey) {
                        alert("Não existe API Key para copiar");
                        return;
                      }

                      navigator.clipboard.writeText(apiKey);

                      alert("API Key copiada!");

                    }}
                  >
                    Copiar
                  </button>

                </div>

                <label className="block text-sm font-bold mb-1">
                  Webhook
                </label>

                <div className="bg-[#0d111d] rounded-lg p-2 text-xs break-all mb-2">

                  https://confirmapix.onrender.com/webhook/
                  {slugLoja || "sualoja"}

                </div>

                <button
                  type="button"
                  className="w-full bg-gray-700 py-2 rounded-lg text-xs mb-3"
                  onClick={() => {

                    if (!slugLoja) {
                      alert("Digite o nome da loja primeiro");
                      return;
                    }

                    navigator.clipboard.writeText(
                      `https://confirmapix.onrender.com/webhook/${slugLoja}`
                    );

                    alert("Webhook copiado!");

                  }}
                >
                  📋 Copiar Webhook
                </button>

                <button
                  type="button"
                  onClick={salvarConfiguracao}
                  className="w-full bg-green-600 py-2 rounded-lg font-bold"
                >
                  Salvar Configuração
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
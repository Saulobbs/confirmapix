import { useEffect, useState } from "react";

export default function Admin() {

  const [clientes, setClientes] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const token = localStorage.getItem("token");

  async function carregarDados() {

    try {

      setCarregando(true);
      setErro("");

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const [resClientes, resEstatisticas] =
        await Promise.all([

          fetch(
            "http://localhost:3000/admin-api/clientes",
            { headers }
          ),

          fetch(
            "http://localhost:3000/admin-api/estatisticas",
            { headers }
          )

        ]);

      const dadosClientes =
        await resClientes.json();

      const dadosEstatisticas =
        await resEstatisticas.json();

      if (!resClientes.ok) {
        throw new Error(
          dadosClientes.erro ||
          "Erro ao carregar clientes"
        );
      }

      if (!resEstatisticas.ok) {
        throw new Error(
          dadosEstatisticas.erro ||
          "Erro ao carregar estatísticas"
        );
      }

      setClientes(
        dadosClientes.clientes || []
      );

      setEstatisticas(
        dadosEstatisticas
      );

    } catch (err) {

      console.error(err);

      setErro(
        err.message ||
        "Erro ao carregar painel"
      );

    } finally {

      setCarregando(false);

    }

  }


  useEffect(() => {

    if (!token) {

      setErro(
        "Você precisa estar logado."
      );

      setCarregando(false);

      return;

    }

    carregarDados();

  }, []);


  async function alterarStatus(
    cliente,
    acao
  ) {

    try {

      const response =
        await fetch(
          `http://localhost:3000/admin-api/clientes/${cliente.id}/${acao}`,
          {
            method: "PUT",
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.erro ||
          "Erro ao alterar cliente"
        );

      }

      await carregarDados();

    } catch (err) {

      alert(
        err.message ||
        "Erro ao realizar operação"
      );

    }

  }


  async function ativarPro(cliente) {

    const confirmar =
      window.confirm(
        `Ativar PRO por 30 dias para ${cliente.nome}?`
      );

    if (!confirmar) {
      return;
    }

    try {

      const response =
        await fetch(
          `http://localhost:3000/admin-api/clientes/${cliente.id}/pro`,
          {
            method: "PUT",
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.erro ||
          "Erro ao ativar PRO"
        );

      }

      alert(
        "PRO ativado por 30 dias."
      );

      await carregarDados();

    } catch (err) {

      alert(
        err.message ||
        "Erro ao ativar PRO"
      );

    }

  }


  function formatarData(data) {

    if (!data) {
      return "-";
    }

    return new Date(data)
      .toLocaleDateString(
        "pt-BR"
      );

  }


  function formatarValor(valor) {

    return Number(valor || 0)
      .toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL"
        }
      );

  }


  if (carregando) {

    return (

      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">

        <div className="text-center">

          <div className="text-4xl mb-4">
            ⏳
          </div>

          <p className="text-gray-400">
            Carregando painel administrativo...
          </p>

        </div>

      </div>

    );

  }


  if (erro) {

    return (

      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-6">

        <div className="bg-[#0d111d] border border-red-500/20 rounded-3xl p-8 max-w-lg w-full text-center">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h1 className="text-2xl font-black mb-3">
            Erro no painel
          </h1>

          <p className="text-red-400 mb-6">
            {erro}
          </p>

          <button
            onClick={carregarDados}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold"
          >
            Tentar novamente
          </button>

        </div>

      </div>

    );

  }


  return (

    <div className="min-h-screen bg-[#050816] text-white p-6 md:p-10">

      <div className="max-w-7xl mx-auto">


        {/* ================================================= */}
        {/* CABEÇALHO */}
        {/* ================================================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

          <div>

            <p className="text-blue-400 font-bold text-sm uppercase tracking-widest">
              ConfirmaPix
            </p>

            <h1 className="text-4xl font-black mt-1">
              Painel Administrativo
            </h1>

            <p className="text-gray-400 mt-2">
              Controle de clientes, lojas e assinaturas.
            </p>

          </div>

          <button
            onClick={carregarDados}
            className="bg-white/10 hover:bg-white/15 border border-white/10 px-5 py-3 rounded-xl font-bold"
          >
            🔄 Atualizar
          </button>

        </div>


        {/* ================================================= */}
        {/* ESTATÍSTICAS */}
        {/* ================================================= */}

        {estatisticas && (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">


            <div className="bg-[#0d111d] border border-white/10 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Clientes
              </p>

              <p className="text-3xl font-black mt-2">
                {estatisticas.totalClientes}
              </p>

            </div>


            <div className="bg-[#0d111d] border border-white/10 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Clientes PRO
              </p>

              <p className="text-3xl font-black text-green-400 mt-2">
                {estatisticas.clientesPro}
              </p>

            </div>


            <div className="bg-[#0d111d] border border-white/10 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Em teste
              </p>

              <p className="text-3xl font-black text-yellow-400 mt-2">
                {estatisticas.clientesTeste}
              </p>

            </div>


            <div className="bg-[#0d111d] border border-white/10 rounded-2xl p-6">

              <p className="text-gray-400 text-sm">
                Receita das assinaturas
              </p>

              <p className="text-3xl font-black text-blue-400 mt-2">
                {formatarValor(
                  estatisticas.receitaTotal
                )}
              </p>

            </div>

          </div>

        )}


        {/* ================================================= */}
        {/* CLIENTES */}
        {/* ================================================= */}

        <div className="bg-[#0d111d] border border-white/10 rounded-3xl overflow-hidden">

          <div className="p-6 border-b border-white/10">

            <h2 className="text-2xl font-black">
              Clientes
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Clientes cadastrados no ConfirmaPix
            </p>

          </div>


          {clientes.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              Nenhum cliente cadastrado.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead>

                  <tr className="border-b border-white/10 text-left text-gray-400 text-sm">

                    <th className="p-5">
                      Cliente
                    </th>

                    <th className="p-5">
                      Loja
                    </th>

                    <th className="p-5">
                      Plano
                    </th>

                    <th className="p-5">
                      Status
                    </th>

                    <th className="p-5">
                      Vencimento
                    </th>

                    <th className="p-5">
                      Ações
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {clientes.map(
                    (cliente) => (

                      <tr
                        key={cliente.id}
                        className="border-b border-white/5 hover:bg-white/[0.02]"
                      >

                        <td className="p-5">

                          <div className="font-bold">
                            {cliente.nome}
                          </div>

                          <div className="text-gray-500 text-sm mt-1">
                            {cliente.email}
                          </div>

                        </td>


                        <td className="p-5">

                          {cliente.loja ? (

                            <>

                              <div className="font-semibold">
                                {cliente.loja.nome}
                              </div>

                              <div className="text-blue-400 text-sm">
                                /{cliente.loja.slug}
                              </div>

                            </>

                          ) : (

                            <span className="text-gray-500">
                              Sem loja
                            </span>

                          )}

                        </td>


                        <td className="p-5">

                          {cliente.plano === "pro" ? (

                            <span className="inline-flex px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold">
                              PRO
                            </span>

                          ) : (

                            <span className="inline-flex px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold">
                              TESTE
                            </span>

                          )}

                        </td>


                        <td className="p-5">

                          {cliente.ativo ? (

                            <span className="inline-flex px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold">
                              ATIVO
                            </span>

                          ) : (

                            <span className="inline-flex px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold">
                              BLOQUEADO
                            </span>

                          )}

                        </td>


                        <td className="p-5 text-gray-300">

                          {cliente.plano === "pro"
                            ? formatarData(
                                cliente.assinaturaExpiraEm
                              )
                            : formatarData(
                                cliente.testeExpiraEm
                              )}

                        </td>


                        <td className="p-5">

                          <div className="flex flex-wrap gap-2">


                            {cliente.plano !== "pro" && (

                              <button
                                onClick={() =>
                                  ativarPro(
                                    cliente
                                  )
                                }
                                className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded-lg text-xs font-bold"
                              >
                                Ativar PRO
                              </button>

                            )}


                            {cliente.ativo ? (

                              <button
                                onClick={() =>
                                  alterarStatus(
                                    cliente,
                                    "bloquear"
                                  )
                                }
                                className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg text-xs font-bold"
                              >
                                Bloquear
                              </button>

                            ) : (

                              <button
                                onClick={() =>
                                  alterarStatus(
                                    cliente,
                                    "ativar"
                                  )
                                }
                                className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-xs font-bold"
                              >
                                Ativar
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}
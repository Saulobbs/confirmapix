import { useEffect, useState } from "react";

export default function Assinatura() {

  const [pix, setPix] = useState(null);
  const [status, setStatus] = useState("pendente");

  useEffect(() => {

    const dados = localStorage.getItem(
      "assinaturaPix"
    );

    if (dados) {
      setPix(JSON.parse(dados));
    }

const pixData = JSON.parse(dados);

setPix(pixData);

const intervalo = setInterval(
  async () => {

    const response = await fetch(
      `http://localhost:3000/assinatura/status/${pixData.pagamentoId}`
    );

    const data =
      await response.json();

    setStatus(data.status);

   if (
  dados.status === "approved" ||
  dados.status === "aprovado"
) {

  setStatus("aprovado");

  setTimeout(() => {
    window.location.href = "/dashboard";
  }, 3000);

}

  },
  5000
);

  }, []);

if (status === "aprovado") {

  return (

    <div className="min-h-screen bg-[#050816] flex items-center justify-center">

      <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-10 text-center max-w-lg">

        <div className="text-6xl mb-4">
          ✅
        </div>

        <h1 className="text-3xl font-black text-green-400 mb-4">
          Assinatura PRO ativada
        </h1>

        <p className="text-gray-300">
          Seu acesso foi liberado.
        </p>

        <p className="text-yellow-400 mt-4">
          Redirecionando...
        </p>

      </div>

    </div>

  );

}

  if (!pix) {

    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center text-white">
        Carregando PIX...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-8">

      <div className="bg-[#0d111d] border border-white/10 rounded-3xl p-8 max-w-xl w-full">

        <h1 className="text-3xl font-black mb-6 text-center">
          Assinatura PRO
        </h1>

        <p className="text-center text-gray-400 mb-4">
          Valor da assinatura
        </p>

        <h2 className="text-4xl font-bold text-green-400 text-center mb-8">
          R$ 19,90
        </h2>

        <img
          src={`data:image/png;base64,${pix.qrCodeBase64}`}
          alt="QR Code PIX"
          className="mx-auto mb-6"
        />

        <textarea
          readOnly
          value={pix.qrCode}
          className="w-full h-40 bg-[#050816] p-4 rounded-xl text-sm"
        />

        <button
          onClick={() =>
            navigator.clipboard.writeText(
              pix.qrCode
            )
          }
          className="w-full mt-4 bg-green-600 py-3 rounded-xl font-bold"
        >
          Copiar PIX
        </button>

       <div className="mt-6 text-center">

  {status === "aprovado" ? (

    <span className="text-green-400 font-bold">
      ✅ Pagamento aprovado
    </span>

  ) : (

    <span className="text-yellow-400">
      ⏳ Aguardando pagamento...
    </span>

  )}

</div>

      </div>

    </div>

  );

}
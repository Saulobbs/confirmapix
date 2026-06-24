import { useEffect, useState } from "react";

export default function Assinatura() {

  const [pix, setPix] = useState(null);

  useEffect(() => {

    const dados = localStorage.getItem(
      "assinaturaPix"
    );

    if (dados) {
      setPix(JSON.parse(dados));
    }

  }, []);

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

        <div className="mt-6 text-center text-yellow-400">
          Aguardando pagamento...
        </div>

      </div>

    </div>

  );

}
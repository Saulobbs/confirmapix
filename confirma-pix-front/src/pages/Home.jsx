import {
  Shield,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Clock3,
  Lock,
  Headphones,
  BarChart3,
} from "lucide-react";
import efiLogo from "../assets/efi.png";
import stoneLogo from "../assets/stone.png";
import pagarmeLogo from "../assets/pagarme.png";
import asaasLogo from "../assets/asaas.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-[#050816] text-white overflow-x-hidden"
      translate="no"
    >

      {/* BLOQUEAR TRADUÇÃO */}
      <meta name="google" content="notranslate" />

      {/* BACKGROUND */}
      <div className="fixed inset-0">

        <div className="absolute top-[-200px] right-[-100px] w-[700px] h-[700px] bg-green-500/10 blur-[160px] rounded-full" />

        <div className="absolute bottom-[-200px] left-[-100px] w-[600px] h-[600px] bg-cyan-500/10 blur-[160px] rounded-full" />

      </div>

      {/* NAVBAR */}
      <header className="relative z-10 border-b border-white/10">

        <div className="max-w-[1700px] mx-auto px-8 py-6 flex items-center justify-between">

          {/* LOGO */}
<div className="flex items-center gap-0">

  <img
    src="/logo.png"
    alt="ConfirmaPix"
    className="
      w-[140px]
      h-[140px]
      object-contain
      drop-shadow-[0_0_25px_rgba(0,255,120,.25)]
    "
    draggable="false"
  />

  <div>
    <h1 className="
      text-5xl
      font-black
      tracking-tight
      leading-none
    ">
      <span className="text-white">
        Confirma
      </span>

      <span className="text-green-400">
        Pix
      </span>
    </h1>

    <p className="
      text-[11px]
      uppercase
      tracking-[7px]
      text-gray-400
      mt-2
    ">
      CONFIRMAÇÃO PIX EM TEMPO REAL
    </p>
  </div>

</div>

          {/* MENU */}
          <div className="hidden xl:flex items-center gap-10 text-gray-300 text-[16px]">

            <a href="#">Recursos</a>
            <a href="#">Integração</a>
            <a href="#">Preços</a>
            <a href="#">API</a>
            <a href="#">Contato</a>

          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-4">

            <Link
  to="/login"
  className="px-6 py-3 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
>
  Entrar
</Link>

<Link
  to="/register"
  className="px-8 py-3 rounded-xl bg-green-400 text-black font-bold hover:scale-105 transition-all shadow-[0_0_30px_rgba(34,197,94,.35)]"
>
  Começar agora
</Link>

          </div>

        </div>

      </header>

      {/* HERO */}
      <section className="relative z-10 pt-24 pb-24">

        <div className="max-w-[1700px] mx-auto px-8 grid xl:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-green-500/30 bg-green-500/10 mb-8">

              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

              <span className="text-green-400 text-sm font-bold uppercase tracking-wide">
                Plataforma PIX Inteligente
              </span>

            </div>

            <h1 className="text-[72px] leading-[0.95] font-black text-[#f6eddc] max-w-[700px]">
              Automação PIX em tempo real
            </h1>

            <h2 className="text-[72px] leading-[0.95] font-black text-green-400 mt-2">
              com integração Mercado Pago
            </h2>

            <p className="text-gray-300 text-[22px] leading-relaxed mt-8 max-w-[780px]">
              Receba notificações instantâneas de pagamentos PIX,
              automatize confirmações e monitore transações em tempo real.
            </p>

            {/* FEATURES */}
            <div className="grid grid-cols-3 gap-10 mt-14">

              <div>

                <Zap className="w-10 h-10 text-yellow-400" />

                <h3 className="font-bold text-xl mt-3">
                  Tempo Real
                </h3>

                <p className="text-gray-400 mt-1">
                  Confirmações instantâneas
                </p>

              </div>

              <div>

                <Shield className="w-10 h-10 text-cyan-300" />

                <h3 className="font-bold text-xl mt-3">
                  Seguro
                </h3>

                <p className="text-gray-400 mt-1">
                  Ambiente protegido
                </p>

              </div>

              <div>

                <BarChart3 className="w-10 h-10 text-orange-400" />

                <h3 className="font-bold text-xl mt-3">
                  Inteligente
                </h3>

                <p className="text-gray-400 mt-1">
                  Dashboard avançado
                </p>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex gap-5 mt-14">

              <button className="px-10 py-5 rounded-2xl bg-green-400 text-black font-black text-xl shadow-[0_0_40px_rgba(34,197,94,.35)] hover:scale-105 transition-all">

                Começar grátis

              </button>

              <button className="px-10 py-5 rounded-2xl border border-white/15 bg-white/[0.03] text-white font-bold text-xl hover:bg-white/[0.06] transition-all">

                Ver demonstração

              </button>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <div className="rounded-[36px] border border-white/10 bg-[#0d111d]/95 p-8 shadow-[0_0_80px_rgba(34,197,94,.12)]">

              {/* TOP */}
              <div className="flex items-center justify-between mb-8">

                <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10">

                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                  <span className="text-orange-400 font-bold text-sm uppercase">
                    Sistema online
                  </span>

                </div>

                <div className="flex items-center gap-4">

  <img
    src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-0.png"
    alt="Mercado Pago"
    className="w-[170px] object-contain"
    draggable="false"
  />

  <div className="hidden xl:flex items-center gap-2">

    <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">

      <span className="text-green-400 text-[11px] font-bold uppercase tracking-wide">
        API Oficial
      </span>

    </div>

    <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">

      <span className="text-cyan-300 text-[11px] font-bold uppercase tracking-wide">
        Webhook
      </span>

    </div>

    <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">

      <span className="text-yellow-300 text-[11px] font-bold uppercase tracking-wide">
        Tempo Real
      </span>

    </div>

  </div>

</div>

              </div>

              {/* SUCCESS */}
              <div className="flex items-center gap-6">

                <div className="w-28 h-28 rounded-full border-[5px] border-green-400 flex items-center justify-center shadow-[0_0_35px_rgba(34,197,94,.25)]">

                  <CheckCircle2 className="w-14 h-14 text-green-400" />

                </div>

                <div>

                  <h2 className="text-[48px] font-black leading-none text-[#f6eddc]">
                    PIX confirmado
                  </h2>

                  <p className="text-green-400 text-xl mt-2 font-semibold">
                    pagamento aprovado automaticamente
                  </p>

                </div>

              </div>

              {/* INFO */}
              <div className="grid grid-cols-3 gap-4 mt-8">

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 notranslate">

                  <p className="text-gray-400 text-sm">
                    Valor
                  </p>

                  <h3 className="text-green-400 text-4xl font-bold tracking-tight mt-2">
                    R$ 497
                  </h3>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                  <p className="text-gray-400 text-sm">
                    Status
                  </p>

                  <div className="mt-3 inline-flex px-4 py-2 rounded-full bg-green-500/15 border border-green-500/20">

                    <span className="text-green-400 font-bold">
                      Confirmado
                    </span>

                  </div>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                  <p className="text-gray-400 text-sm">
                    Tempo
                  </p>

                  <h3 className="text-white text-4xl font-bold tracking-tight mt-2">
                    1.2s
                  </h3>

                </div>

              </div>

              {/* TRANSACTIONS */}
              <div className="mt-8 rounded-3xl border border-white/10 overflow-hidden">

                <div className="flex justify-between px-6 py-5 border-b border-white/10">

                  <h3 className="font-bold text-xl">
                    Transações em tempo real
                  </h3>

                  <span className="text-gray-400">
                    Ver todas →
                  </span>

                </div>

                {[
                  ["R$ 497,00", "23:18:45"],
                  ["R$ 250,00", "23:17:22"],
                  ["R$ 120,00", "23:16:05"],
                  ["R$ 89,90", "23:14:33"],
                ].map((item, i) => (

                  <div
                    key={i}
                    className="grid grid-cols-[1fr_1fr_1fr] items-center px-6 py-5 border-b border-white/5"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">

                        <ArrowUpRight className="w-5 h-5 text-green-400" />

                      </div>

                      <span className="font-bold text-lg">
                        {item[0]}
                      </span>

                    </div>

                    <span className="text-gray-300">
                      {item[1]}
                    </span>

                    <div className="flex justify-end">

                      <div className="px-4 py-2 rounded-full bg-green-500/15 border border-green-500/20">

                        <span className="text-green-400 font-bold text-sm">
                          Confirmado
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

</section>

{/* EM BREVE */}
<section className="relative z-10 pb-24">

  <div className="max-w-[1700px] mx-auto px-8">

    <div className="rounded-[30px] border border-white/10 bg-[#0d111d]/90 overflow-hidden">

      <div className="grid xl:grid-cols-5">

        {/* LEFT */}
        <div className="p-10 border-r border-white/10 flex flex-col justify-center">

          <h3 className="text-4xl font-black text-[#f6eddc]">
            Em breve
          </h3>

          <p className="text-gray-400 text-lg mt-3 leading-relaxed max-w-[260px]">
            Novas integrações
            em desenvolvimento.
          </p>

        </div>

        {/* EFI */}
<div className="flex flex-col items-center justify-center border-r border-white/10 py-12">

  <img
    src={efiLogo}
    alt="EFI"
    className="
      h-24
      object-contain
      invert
      brightness-0
      opacity-40
      hover:opacity-70
      transition-all
      duration-300
    "
    draggable="false"
  />

  <div className="mt-6 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10">

    <span className="text-gray-300 text-sm font-medium">
      Em breve
    </span>

  </div>

</div>

{/* STONE */}
<div className="flex flex-col items-center justify-center border-r border-white/10 py-12">

  <img
    src={stoneLogo}
    alt="Stone"
    className="
      h-24
      object-contain
      invert
      brightness-0
      opacity-40
      hover:opacity-70
      transition-all
      duration-300
    "
    draggable="false"
  />

  <div className="mt-6 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10">

    <span className="text-gray-300 text-sm font-medium">
      Em breve
    </span>

  </div>

</div>

{/* PAGARME */}
<div className="flex flex-col items-center justify-center border-r border-white/10 py-12">

  <img
    src={pagarmeLogo}
    alt="Pagar.me"
    className="
      h-24
      object-contain
      invert
      brightness-0
      opacity-40
      hover:opacity-70
      transition-all
      duration-300
    "
    draggable="false"
  />

  <div className="mt-6 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10">

    <span className="text-gray-300 text-sm font-medium">
      Em breve
    </span>

  </div>

</div>

{/* ASAAS */}
<div className="flex flex-col items-center justify-center py-12">

  <img
    src={asaasLogo}
    alt="ASAAS"
    className="
      h-24
      object-contain
      invert
      brightness-0
      opacity-40
      hover:opacity-70
      transition-all
      duration-300
    "
    draggable="false"
  />

  <div className="mt-6 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10">

    <span className="text-gray-300 text-sm font-medium">
      Em breve
    </span>

  </div>

</div>

      </div>

    </div>

  </div>

</section>

    </div>

  );
}
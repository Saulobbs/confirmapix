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

        <div className="absolute top-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-green-500/10 blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[130px] xl:top-[-200px] xl:right-[-100px] xl:h-[700px] xl:w-[700px] xl:blur-[160px]" />

        <div className="absolute bottom-[-120px] left-[-120px] h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[100px] sm:h-[450px] sm:w-[450px] sm:blur-[130px] xl:bottom-[-200px] xl:left-[-100px] xl:h-[600px] xl:w-[600px] xl:blur-[160px]" />

      </div>

      {/* NAVBAR */}
      <header className="relative z-10 border-b border-white/10">

        <div className="mx-auto flex w-full min-w-0 max-w-[1700px] flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:py-6 xl:flex-nowrap xl:px-8">

          {/* LOGO */}
<div className="flex min-w-0 items-center gap-0">

  <img
    src="/logo.png"
    alt="ConfirmaPix"
    className="
      w-16 h-16 sm:w-20 sm:h-20 xl:w-[140px]
      xl:h-[140px]
      object-contain
      drop-shadow-[0_0_25px_rgba(0,255,120,.25)]
    "
    draggable="false"
  />

  <div className="min-w-0">
    <h1 className="
      text-2xl sm:text-4xl xl:text-5xl
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
      text-[9px] sm:text-[10px] xl:text-[11px]
      uppercase
      tracking-[2px] sm:tracking-[4px] xl:tracking-[7px]
      text-gray-400
      mt-2
    ">
      CONFIRMAÇÃO PIX EM TEMPO REAL
    </p>
  </div>

</div>

          {/* MENU */}
          <nav aria-label="Navegação principal" className="grid w-full grid-cols-2 gap-x-3 gap-y-1 text-sm text-gray-300 md:order-last md:flex md:justify-center md:gap-5 md:text-base xl:order-none xl:w-auto xl:flex-nowrap xl:items-center xl:gap-10 xl:text-[16px] [&>a]:flex [&>a]:min-h-11 [&>a]:items-center [&>a]:rounded-lg [&>a]:px-3 [&>a]:py-2 xl:[&>a]:min-h-0 xl:[&>a]:rounded-none xl:[&>a]:px-0 xl:[&>a]:py-0">

            <a href="#">Recursos</a>
            <a href="#">Integração</a>
            <a href="#">Preços</a>
            <a href="#">API</a>
            <a href="#">Contato</a>

          </nav>

          {/* BUTTONS */}
          <div className="flex w-full items-center gap-3 sm:w-auto sm:gap-4">

            <Link
  to="/login"
  className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-center transition-all hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 sm:flex-none sm:px-6 xl:px-6"
>
  Entrar
</Link>

<Link
  to="/register"
  className="flex-1 rounded-xl bg-green-400 px-4 py-3 text-center font-bold text-black shadow-[0_0_30px_rgba(34,197,94,.35)] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex-none sm:px-6 xl:px-8"
>
  Começar agora
</Link>

          </div>

        </div>

      </header>

      {/* HERO */}
      <section className="relative z-10 pt-12 pb-12 sm:pt-16 sm:pb-16 xl:pt-24 xl:pb-24">

        <div className="mx-auto grid w-full min-w-0 max-w-[1700px] grid-cols-1 items-center gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 xl:gap-16 xl:px-8">

          {/* LEFT */}
          <div className="min-w-0">

            <div className="mb-6 inline-flex max-w-full items-center gap-3 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-3 sm:mb-8 sm:px-5">

              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

              <span className="min-w-0 break-words text-sm font-bold uppercase tracking-wide text-green-400">
                Plataforma PIX Inteligente
              </span>

            </div>

            <h1 className="max-w-[700px] text-4xl font-black leading-[0.98] text-[#f6eddc] sm:text-5xl lg:text-6xl xl:text-[72px] xl:leading-[0.95]">
              Automação PIX em tempo real
            </h1>

            <h2 className="mt-2 text-4xl font-black leading-[0.98] text-green-400 sm:text-5xl lg:text-6xl xl:text-[72px] xl:leading-[0.95]">
              com integração Mercado Pago
            </h2>

            <p className="mt-6 max-w-[780px] text-lg leading-relaxed text-gray-300 sm:mt-8 sm:text-xl xl:text-[22px]">
              Receba notificações instantâneas de pagamentos PIX,
              automatize confirmações e monitore transações em tempo real.
            </p>

            {/* FEATURES */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:mt-14 xl:gap-10">

              <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0">

                <Zap className="w-10 h-10 text-yellow-400" />

                <h3 className="font-bold text-xl mt-3">
                  Tempo Real
                </h3>

                <p className="text-gray-400 mt-1">
                  Confirmações instantâneas
                </p>

              </div>

              <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0">

                <Shield className="w-10 h-10 text-cyan-300" />

                <h3 className="font-bold text-xl mt-3">
                  Seguro
                </h3>

                <p className="text-gray-400 mt-1">
                  Ambiente protegido
                </p>

              </div>

              <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0">

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
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4 xl:mt-14 xl:gap-5">

              <button className="w-full rounded-2xl bg-green-400 px-5 py-4 text-lg font-black text-black shadow-[0_0_40px_rgba(34,197,94,.35)] transition-all hover:scale-105 sm:flex-1 sm:px-6 xl:w-auto xl:flex-none xl:px-10 xl:py-5 xl:text-xl">

                Começar grátis

              </button>

              <button className="w-full rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-4 text-lg font-bold text-white transition-all hover:bg-white/[0.06] sm:flex-1 sm:px-6 xl:w-auto xl:flex-none xl:px-10 xl:py-5 xl:text-xl">

                Ver demonstração

              </button>

            </div>

          </div>

          {/* RIGHT */}
          <div className="w-full min-w-0">

            <div className="min-w-0 rounded-[24px] border border-white/10 bg-[#0d111d]/95 p-4 shadow-[0_0_80px_rgba(34,197,94,.12)] sm:rounded-[30px] sm:p-6 xl:rounded-[36px] xl:p-8">

              {/* TOP */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between xl:mb-8 xl:gap-0">

                <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10">

                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                  <span className="text-orange-400 font-bold text-sm uppercase">
                    Sistema online
                  </span>

                </div>

                <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end sm:gap-4">

  <img
    src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-0.png"
    alt="Mercado Pago"
    className="h-auto w-32 max-w-full object-contain sm:w-40 xl:w-[170px]"
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
              <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">

                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-green-400 shadow-[0_0_35px_rgba(34,197,94,.25)] sm:h-24 sm:w-24 sm:border-[5px] xl:h-28 xl:w-28">

                  <CheckCircle2 className="h-10 w-10 text-green-400 sm:h-12 sm:w-12 xl:h-14 xl:w-14" />

                </div>

                <div className="min-w-0">

                  <h2 className="text-3xl font-black leading-tight text-[#f6eddc] sm:text-4xl xl:text-[48px] xl:leading-none">
                    PIX confirmado
                  </h2>

                  <p className="mt-2 text-base font-semibold text-green-400 sm:text-lg xl:text-xl">
                    pagamento aprovado automaticamente
                  </p>

                </div>

              </div>

              {/* INFO */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:mt-8 xl:grid-cols-3">

                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 xl:p-5 notranslate">

                  <p className="text-gray-400 text-sm">
                    Valor
                  </p>

                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-green-400 xl:text-4xl">
                    R$ 497
                  </h3>

                </div>

                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 xl:p-5">

                  <p className="text-gray-400 text-sm">
                    Status
                  </p>

                  <div className="mt-3 inline-flex px-4 py-2 rounded-full bg-green-500/15 border border-green-500/20">

                    <span className="text-green-400 font-bold">
                      Confirmado
                    </span>

                  </div>

                </div>

                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-2 xl:col-span-1 xl:p-5">

                  <p className="text-gray-400 text-sm">
                    Tempo
                  </p>

                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-white xl:text-4xl">
                    1.2s
                  </h3>

                </div>

              </div>

              {/* TRANSACTIONS */}
              <div className="mt-6 min-w-0 overflow-hidden rounded-3xl border border-white/10 sm:mt-8">

                <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-4 sm:flex-row sm:justify-between sm:px-6 sm:py-5">

                  <h3 className="font-bold text-lg sm:text-xl">
                    Transações em tempo real
                  </h3>

                  <span className="text-gray-400 sm:text-right">
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
                    className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 border-b border-white/5 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:px-6 sm:py-5 xl:grid-cols-[1fr_1fr_1fr] xl:gap-x-0 xl:gap-y-0"
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">

                        <ArrowUpRight className="w-5 h-5 text-green-400" />

                      </div>

                      <span className="min-w-0 break-words font-bold sm:text-lg">
                        {item[0]}
                      </span>

                    </div>

                    <span className="text-sm text-gray-300 sm:text-base">
                      {item[1]}
                    </span>

                    <div className="col-span-2 flex justify-start sm:col-span-1 sm:justify-end">

                      <div className="rounded-full border border-green-500/20 bg-green-500/15 px-3 py-2 sm:px-4">

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
<section className="relative z-10 pb-12 sm:pb-16 xl:pb-24">

  <div className="mx-auto w-full min-w-0 max-w-[1700px] px-4 sm:px-6 xl:px-8">

    <div className="min-w-0 overflow-hidden rounded-[24px] border border-white/10 bg-[#0d111d]/90 sm:rounded-[30px]">

      <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">

        {/* LEFT */}
        <div className="flex flex-col justify-center border-b border-white/10 p-6 sm:col-span-2 sm:p-8 xl:col-span-1 xl:border-b-0 xl:border-r xl:p-10">

          <h3 className="text-3xl font-black text-[#f6eddc] sm:text-4xl">
            Em breve
          </h3>

          <p className="mt-3 max-w-[260px] text-base leading-relaxed text-gray-400 sm:text-lg">
            Novas integrações
            em desenvolvimento.
          </p>

        </div>

        {/* EFI */}
<div className="flex min-w-0 flex-col items-center justify-center border-b border-white/10 py-8 sm:border-r sm:border-b-0 sm:py-10 xl:py-12">

  <img
    src={efiLogo}
    alt="EFI"
    className="
      h-16 sm:h-20 xl:h-24
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

  <div className="mt-4 max-w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 sm:mt-6 sm:px-5">

    <span className="text-gray-300 text-sm font-medium">
      Em breve
    </span>

  </div>

</div>

{/* STONE */}
<div className="flex min-w-0 flex-col items-center justify-center border-b border-white/10 py-8 sm:border-b-0 sm:py-10 xl:border-r xl:py-12">

  <img
    src={stoneLogo}
    alt="Stone"
    className="
      h-16 sm:h-20 xl:h-24
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

  <div className="mt-4 max-w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 sm:mt-6 sm:px-5">

    <span className="text-gray-300 text-sm font-medium">
      Em breve
    </span>

  </div>

</div>

{/* PAGARME */}
<div className="flex min-w-0 flex-col items-center justify-center border-b border-white/10 py-8 sm:border-r sm:border-b-0 sm:py-10 xl:py-12">

  <img
    src={pagarmeLogo}
    alt="Pagar.me"
    className="
      h-16 sm:h-20 xl:h-24
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

  <div className="mt-4 max-w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 sm:mt-6 sm:px-5">

    <span className="text-gray-300 text-sm font-medium">
      Em breve
    </span>

  </div>

</div>

{/* ASAAS */}
<div className="flex min-w-0 flex-col items-center justify-center py-8 sm:py-10 xl:py-12">

  <img
    src={asaasLogo}
    alt="ASAAS"
    className="
      h-16 sm:h-20 xl:h-24
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

  <div className="mt-4 max-w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 sm:mt-6 sm:px-5">

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

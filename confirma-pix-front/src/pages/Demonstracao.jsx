import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Bell, Check, CheckCircle2,
  CircleDollarSign, Clock3, Code2, LayoutDashboard, QrCode,
  RotateCcw, ShieldCheck, Webhook,
} from "lucide-react";
import "./Demonstracao.css";

const etapas = ["PIX", "Confirmação", "Webhook", "Notificação", "Dashboard"];

export default function Demonstracao() {
  const [etapa, setEtapa] = useState(0);
  const [execucao, setExecucao] = useState(0);

  useEffect(() => {
    if (etapa >= etapas.length - 1) return undefined;
    const timer = window.setTimeout(() => setEtapa((atual) => Math.min(atual + 1, etapas.length - 1)), 1800);
    return () => window.clearTimeout(timer);
  }, [etapa, execucao]);

  function reiniciar() {
    setEtapa(0);
    setExecucao((atual) => atual + 1);
  }

  return (
    <main className="demo-page">
      <div className="demo-glow demo-glow-top" />
      <div className="demo-glow demo-glow-bottom" />
      <div className="demo-shell">
        <header className="demo-header">
          <Link to="/" className="demo-back"><ArrowLeft size={18} /> Voltar</Link>
          <Link to="/" className="demo-brand" aria-label="ConfirmaPix, início"><img src="/logo.png" alt="" /><span>Confirma<span>Pix</span></span></Link>
          <span className="demo-mode"><span /> Demonstração simulada</span>
        </header>

        <section className="demo-intro">
          <span className="demo-eyebrow"><span /> EXPERIÊNCIA CONFIRMAPIX</span>
          <h1>Veja o ConfirmaPix funcionando</h1>
          <p>Do pagamento confirmado à notificação em poucos segundos.</p>
          <div className="demo-disclaimer"><ShieldCheck size={16} /><span>Esta é uma simulação visual. Nenhum pagamento ou integração real é acionado.</span></div>
        </section>

        <section className="demo-stage" aria-label="Etapas da demonstração">
          <div className="demo-progress" role="list">
            {etapas.map((nome, index) => <div className={`demo-progress-step ${index <= etapa ? "is-reached" : ""} ${index === etapa ? "is-current" : ""}`} key={nome} role="listitem"><span>{index < etapa ? <Check size={14} /> : index + 1}</span><small>{nome}</small></div>)}
          </div>
          {etapa < etapas.length - 1 && <div className="demo-processing"><span className="demo-spinner" />{etapa === 0 ? "Aguardando confirmação…" : "Processando próxima etapa…"}</div>}

          <div className="demo-flow">
            <article className={`demo-card ${etapa === 0 ? "card-current" : "card-done"} demo-enter`} key={`pix-${execucao}`}>
              <div className="demo-card-top"><div className="demo-icon icon-blue"><QrCode size={21} /></div><span className={`demo-status ${etapa === 0 ? "status-waiting" : "status-success"}`}>{etapa === 0 ? <><Clock3 size={13} /> Aguardando</> : <><CheckCircle2 size={13} /> Enviado</>}</span></div>
              <h2>PIX enviado</h2><p className="demo-amount">R$ 150,00</p><p className="demo-muted">{etapa === 0 ? "Pagamento aguardando confirmação" : "Cobrança enviada para pagamento"}</p>
              <div className="demo-card-footer"><span>Transação demonstrativa</span><span>•••• 4821</span></div>
            </article>

            {etapa >= 1 && <article className={`demo-card ${etapa === 1 ? "card-current" : "card-done"} demo-enter`} key={`approved-${execucao}`}>
              <div className="demo-card-top"><div className="demo-icon icon-green"><CheckCircle2 size={22} /></div><span className="demo-status status-success"><Check size={13} /> Aprovado</span></div>
              <h2>✓ Pagamento aprovado</h2><p className="demo-amount">R$ 150,00</p><p className="demo-muted">Pagamento confirmado</p>
              <div className="demo-card-footer"><span>Confirmação visual</span><span className="demo-check-label"><Check size={13} /> Confirmado</span></div>
            </article>}

            {etapa >= 2 && <article className={`demo-card ${etapa === 2 ? "card-current" : "card-done"} demo-enter`} key={`webhook-${execucao}`}>
              <div className="demo-card-top"><div className="demo-icon icon-cyan"><Webhook size={21} /></div><span className="demo-status status-success"><Check size={13} /> Recebido</span></div>
              <h2>✓ Confirmação recebida</h2><p className="demo-code-line"><Code2 size={15} /> Webhook processado</p><p className="demo-muted">O ConfirmaPix recebeu a confirmação do pagamento.</p>
              <div className="demo-card-footer"><span>Evento simulado</span><span>PIX aprovado</span></div>
            </article>}

            {etapa >= 3 && <article className={`demo-card demo-notification demo-enter ${etapa === 3 ? "card-current" : "card-done"}`} key={`notification-${execucao}`}>
              <div className="demo-notification-head"><div className="demo-icon icon-green"><Bell size={20} /></div><span>AGORA</span></div><strong>💰 PIX RECEBIDO</strong><p>Você recebeu R$ 150,00</p><small>ConfirmaPix · demonstração</small>
            </article>}

            {etapa >= 4 && <article className="demo-dashboard demo-enter" key={`dashboard-${execucao}`}>
              <div className="demo-dashboard-head"><div><span className="demo-icon icon-cyan"><LayoutDashboard size={20} /></span><div><h2>Dashboard</h2><p>Resumo de recebimentos</p></div></div><span className="demo-live"><i /> Atualizado</span></div>
              <div className="demo-metrics"><div><span>Total recebido</span><strong>R$ 150,00</strong><CircleDollarSign /></div><div><span>PIX aprovados</span><strong>1</strong><CheckCircle2 /></div><div><span>Pendentes</span><strong>0</strong><Clock3 /></div></div>
              <div className="demo-history-label">ÚLTIMA TRANSAÇÃO</div><div className="demo-history-row"><span className="demo-history-check"><Check size={16} /></span><div><strong>PIX recebido — R$ 150,00</strong><small>Agora · simulação</small></div><span className="demo-history-approved">Aprovado</span></div>
            </article>}
          </div>

          <div className="demo-stage-controls"><p>{etapa === etapas.length - 1 ? "Demonstração concluída" : `Etapa ${etapa + 1} de ${etapas.length}`}</p><button type="button" onClick={reiniciar}><RotateCcw size={15} /> Reiniciar demonstração</button></div>
        </section>

        <section className="demo-cta"><div><span className="demo-eyebrow"><span /> SEU PRÓXIMO PASSO</span><h2>Pronto para começar?</h2><p>Automatize a confirmação dos seus pagamentos PIX.</p></div><Link to="/register">Começar grátis <ArrowRight size={17} /></Link></section>
        <footer className="demo-footer"><span>ConfirmaPix</span><span>Apresentação demonstrativa · sem transações reais</span></footer>
      </div>
    </main>
  );
}

import {
  ArrowLeft, ArrowRight, BarChart3, Bell, Check, CircleHelp,
  Clock3, Code2, CreditCard, Landmark, LockKeyhole, Mail,
  QrCode, Search, ShieldCheck, WalletCards, Webhook,
} from "lucide-react";
import { Link } from "react-router-dom";
import efiLogo from "../assets/efi.png";
import stoneLogo from "../assets/stone.png";
import pagarmeLogo from "../assets/pagarme.png";
import asaasLogo from "../assets/asaas.png";
import "./InfoPages.css";

const iconMap = { QrCode, Check, Search, BarChart3, Bell, LockKeyhole, Webhook, CreditCard };

function SiteHeader() {
  return (
    <header className="info-header">
      <Link className="info-brand" to="/" aria-label="Voltar para a página inicial">
        <img src="/logo.png" alt="" />
        <span>Confirma<span>Pix</span></span>
      </Link>
      <Link className="info-back" to="/"><ArrowLeft size={17} /> <span>Voltar ao início</span></Link>
    </header>
  );
}

function InfoLayout({ eyebrow, title, description, children }) {
  return (
    <main className="info-page">
      <div className="info-glow info-glow-one" />
      <div className="info-glow info-glow-two" />
      <div className="info-shell">
        <SiteHeader />
        <section className="info-hero">
          <span className="info-eyebrow"><span />{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </section>
        {children}
        <footer className="info-footer"><Link to="/">ConfirmaPix</Link><span>Confirmação PIX em tempo real</span></footer>
      </div>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, children }) {
  return <article className="info-card"><div className="info-icon"><Icon size={21} /></div><h3>{title}</h3><p>{children}</p></article>;
}

export function Recursos() {
  const features = [
    [QrCode, "Geração de PIX", "Gere cobranças PIX pelo fluxo disponível na plataforma."],
    [Check, "Confirmação de pagamento", "Acompanhe o status das transações recebidas."],
    [Search, "Busca e filtros", "Localize transações no histórico com os filtros e a busca existentes."],
    [BarChart3, "Dashboard", "Visualize totais e transações no painel da sua conta."],
    [Bell, "Notificações", "A plataforma possui suporte a notificações de pagamentos confirmados."],
    [LockKeyhole, "Configuração segura", "As configurações de integração ficam disponíveis na área autenticada."],
  ].map(([icon, title, body]) => ({ icon: iconMap[icon.name] || icon, title, body }));
  return <InfoLayout eyebrow="Plataforma" title="Recursos para acompanhar seus recebimentos" description="Conheça as ferramentas disponíveis no ConfirmaPix para gerar e acompanhar cobranças PIX.">
    <section className="info-grid info-grid-three">{features.map(({ icon, title, body }) => <FeatureCard key={title} icon={icon} title={title}>{body}</FeatureCard>)}</section>
    <div className="info-callout"><ShieldCheck /><div><strong>Um painel para sua operação</strong><p>Dashboard, histórico de transações e configuração da conta ficam reunidos no mesmo ambiente.</p></div><Link to="/register">Começar agora <ArrowRight size={16} /></Link></div>
  </InfoLayout>;
}

const institutions = [
  { name: "Mercado Pago", status: "Integração disponível", live: true },
  { name: "EFI", status: "Em breve", logo: efiLogo },
  { name: "Stone", status: "Em breve", logo: stoneLogo },
  { name: "Pagar.me", status: "Em breve", logo: pagarmeLogo },
  { name: "Asaas", status: "Em breve", logo: asaasLogo },
  ...["CAIXA", "Bradesco", "Itaú", "Santander", "Nubank"].map((name) => ({ name, status: "Em breve" })),
];

export function Integracoes() {
  return <InfoLayout eyebrow="Conectividade" title="Integrações" description="Veja as instituições previstas e a integração atualmente disponível no ConfirmaPix.">
    <div className="info-callout integration-callout"><div className="info-icon live-icon"><Check size={22} /></div><div><strong>Mercado Pago está disponível</strong><p>É a integração atual da plataforma para recebimentos PIX.</p></div><span className="live-pill"><i /> Disponível</span></div>
    <section className="institution-section"><div className="section-heading"><div><span className="info-eyebrow">Instituições</span><h2>Contas e provedores</h2></div><span className="soon-note">As demais integrações estão previstas para versões futuras.</span></div>
      <div className="info-grid info-grid-three">{institutions.map((item) => <article className={`institution-card ${item.live ? "institution-live" : ""}`} key={item.name}><div className="institution-logo">{item.logo ? <img src={item.logo} alt={item.name} /> : item.live ? <CreditCard /> : <Landmark />}</div><div className="institution-copy"><strong>{item.name}</strong><span>{item.status}</span></div><span className={item.live ? "live-pill" : "soon-pill"}>{item.live && <i />}{item.status}</span></article>)}</div>
    </section>
    <section className="flow-panel"><div><span className="info-eyebrow">Como funciona</span><h2>Do pagamento à confirmação</h2></div><div className="flow-steps">{[[QrCode,"Pagamento PIX"],[Landmark,"Instituição"],[Webhook,"ConfirmaPix"],[Bell,"Confirmação"]].map(([Icon,label], index)=><div className="flow-step" key={label}><div className="info-icon"><Icon size={20} /></div><span>{label}</span>{index < 3 && <ArrowRight className="flow-arrow" size={17} />}</div>)}</div></section>
  </InfoLayout>;
}

export function Precos() {
  const plans = ["Essencial", "Profissional", "Empresarial"];
  const details = ["Recursos do plano: definir", "Limites de uso: definir", "Suporte: definir", "Integrações: definir"];
  return <InfoLayout eyebrow="Planos" title="Escolha o plano ideal para sua operação" description="Os planos e valores ainda estão sendo definidos. Entre na plataforma para conhecer a experiência disponível hoje.">
    <section className="info-grid info-grid-three pricing-grid">{plans.map((plan, i) => <article className={`price-card ${i === 1 ? "price-featured" : ""}`} key={plan}>{i === 1 && <span className="popular-label">Em destaque</span>}<span className="plan-label">Plano {String(i + 1).padStart(2,"0")}</span><h2>{plan}</h2><p className="price-value">A definir</p><span className="price-caption">Valores e condições em definição</span><div className="price-divider" />{details.map((d)=><div className="price-detail" key={d}><Check size={16} />{d}</div>)}<Link to="/register" className="info-button">Conhecer a plataforma <ArrowRight size={16} /></Link></article>)}</section>
    <p className="price-footnote">Os nomes são referências visuais de planos. Valores, recursos, limites e condições ainda não foram publicados.</p>
  </InfoLayout>;
}

const endpoints = [
  { method: "POST", path: "/auth/register", description: "Cadastro de usuário. Campos observados no servidor: nome, email e senha." },
  { method: "POST", path: "/auth/login", description: "Autenticação de usuário com email e senha." },
  { method: "PUT", path: "/auth/config", description: "Atualização de configuração de integração. Rota protegida por token." },
  { method: "GET", path: "/dashboard/stats", description: "Estatísticas e transações do dashboard. Rota protegida por token; aceita período, página, limite, status e busca." },
  { method: "GET", path: "/pix/:slug", description: "Página de cobrança PIX associada ao identificador da loja. A resposta é uma página HTML." },
  { method: "GET", path: "/status/:paymentId", description: "Consulta o status do pagamento pelo identificador." },
  { method: "POST", path: "/assinatura/pix", description: "Geração de PIX de assinatura. O servidor espera userId no corpo." },
  { method: "GET", path: "/assinatura/status/:pagamentoId", description: "Consulta o status de um pagamento de assinatura pelo identificador." },
  { method: "POST", path: "/webhook", description: "Recebe notificações de pagamento do Mercado Pago; valida o status consultando o provedor." },
  { method: "POST", path: "/assinatura/webhook", description: "Recebe notificações relacionadas ao pagamento da assinatura." },
];

export function ApiDocs() {
  return <InfoLayout eyebrow="Para desenvolvedores" title="API ConfirmaPix" description="As rotas abaixo foram identificadas no código atual do servidor. A documentação completa de integração está em desenvolvimento.">
    <div className="docs-layout"><aside className="docs-nav"><strong>Nesta página</strong><a href="#overview">Visão geral</a><a href="#routes">Rotas identificadas</a><a href="#auth">Autenticação</a><a href="#webhook">Webhooks</a></aside><div className="docs-content">
      <section className="docs-panel" id="overview"><div className="docs-title"><div className="info-icon"><Code2 /></div><div><h2>Visão geral</h2><p>Referência inicial baseada nas rotas presentes no servidor do projeto.</p></div></div><div className="docs-notice"><CircleHelp size={18} /><span>Documentação em desenvolvimento. Não use esta página como especificação de integração.</span></div></section>
      <section className="docs-panel" id="routes"><h2>Rotas identificadas</h2><div className="endpoint-list">{endpoints.map((e)=><article className="endpoint" key={e.path}><div className="endpoint-heading"><span className={`method method-${e.method.toLowerCase()}`}>{e.method}</span><code>{e.path}</code></div><p>{e.description}</p></article>)}</div></section>
      <section className="docs-panel" id="auth"><h2>Autenticação</h2><p>As rotas protegidas verificam o token recebido no cabeçalho <code>Authorization</code> com o prefixo <code>Bearer</code>. Os detalhes de emissão, renovação e escopos estão em desenvolvimento.</p></section>
      <section className="docs-panel" id="webhook"><h2>Webhooks</h2><p>O servidor possui rotas de webhook para pagamentos e assinaturas. Payloads, eventos suportados e configuração para integrações externas: <strong>documentação em desenvolvimento</strong>.</p></section>
    </div></div>
  </InfoLayout>;
}

export function Contato() {
  return <InfoLayout eyebrow="Fale com a gente" title="Contato" description="Estamos preparando nossos canais de atendimento. As informações serão publicadas nesta página em breve.">
    <div className="contact-layout"><section className="contact-panel"><div className="info-icon"><Mail /></div><h2>Entre em contato</h2><p>Os canais oficiais de contato ainda não foram configurados nesta página. Nenhum email ou telefone foi informado para evitar divulgar dados incorretos.</p><div className="contact-placeholder"><Clock3 size={19} /><span>Informações de contato em breve</span></div></section>
      <section className="contact-panel contact-form"><h2>Envie uma mensagem</h2><p>Formulário visual. O envio ainda não está conectado a um serviço.</p><label>Nome<input type="text" placeholder="Seu nome" disabled /></label><label>Email<input type="email" placeholder="voce@exemplo.com" disabled /></label><label>Mensagem<textarea rows="4" placeholder="Como podemos ajudar?" disabled /></label><button type="button" disabled>Envio disponível em breve</button><small>Este formulário ainda não envia mensagens.</small></section></div>
  </InfoLayout>;
}

const express = require("express");
const jwt = require("jsonwebtoken");

const Pagamento = require("../models/pagamento");
const Merchant = require("../models/merchant");

const router = express.Router();

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não informado" });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

function obterIntervalo(periodo, agora = new Date()) {
  const inicioHoje = new Date(agora);
  inicioHoje.setHours(0, 0, 0, 0);
  const inicioAmanha = new Date(inicioHoje);
  inicioAmanha.setDate(inicioAmanha.getDate() + 1);

  switch (periodo) {
    case "hoje":
      return { $gte: inicioHoje, $lt: inicioAmanha };
    case "este-mes":
      return {
        $gte: new Date(agora.getFullYear(), agora.getMonth(), 1),
        $lt: new Date(agora.getFullYear(), agora.getMonth() + 1, 1)
      };
    case "mes-anterior":
      return {
        $gte: new Date(agora.getFullYear(), agora.getMonth() - 1, 1),
        $lt: new Date(agora.getFullYear(), agora.getMonth(), 1)
      };
    case "ultimos-7-dias":
      return { $gte: new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000), $lte: agora };
    case "ultimos-30-dias":
      return { $gte: new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000), $lte: agora };
    default:
      return null;
  }
}

function escaparRegex(valor) {
  return valor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function obterFiltroBusca(busca) {
  const termo = String(busca || "").trim();
  if (!termo) return null;

  const partes = [
    { status: { $regex: escaparRegex(termo), $options: "i" } }
  ];

  const textoNumerico = termo.replace(/[^\d,.-]/g, "");
  const numeroNormalizado = textoNumerico.includes(",")
    ? textoNumerico.replace(/\./g, "").replace(",", ".")
    : textoNumerico;
  const numero = Number(numeroNormalizado);
  if (Number.isFinite(numero) && /\d/.test(termo)) {
    partes.push({ valor: numero });
  }

  const dataIso = termo.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const dataBr = termo.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const partesData = dataIso || (dataBr && [dataBr[0], dataBr[3], dataBr[2], dataBr[1]]);
  if (partesData) {
    const inicio = new Date(Number(partesData[1]), Number(partesData[2]) - 1, Number(partesData[3]));
    if (!Number.isNaN(inicio.getTime())) {
      const fim = new Date(inicio);
      fim.setDate(fim.getDate() + 1);
      partes.push({ criadoEm: { $gte: inicio, $lt: fim } });
    }
  }

  return { $or: partes };
}

router.get("/stats", verificarToken, async (req, res) => {
  try {
    const periodo = req.query.periodo || "todos";
    const paginaAtual = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const quantidadePorPagina = Math.min(20, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const pular = (paginaAtual - 1) * quantidadePorPagina;
    const merchant = await Merchant.findOne({ userId: req.usuario.id });

    if (!merchant) {
      return res.json({
        periodo,
        pagamentosHoje: 0,
        pixConfirmados: 0,
        pixPendentes: 0,
        totalRecebido: 0,
        registrosTotais: 0,
        transacoes: [],
        paginaAtual,
        quantidadePorPagina,
        totalRegistros: 0,
        totalPaginas: 0
      });
    }

    const filtroPeriodo = { merchantId: merchant._id };
    const intervalo = obterIntervalo(periodo);
    if (intervalo) filtroPeriodo.criadoEm = intervalo;

    const filtroHistorico = { ...filtroPeriodo };
    if (req.query.status === "aprovado") {
      filtroHistorico.status = "aprovado";
    } else if (req.query.status === "pendente") {
      filtroHistorico.status = { $ne: "aprovado" };
    }

    const filtroBusca = obterFiltroBusca(req.query.busca);
    if (filtroBusca) {
      if (filtroHistorico.$or) {
        filtroHistorico.$and = [{ $or: filtroHistorico.$or }, filtroBusca];
        delete filtroHistorico.$or;
      } else {
        Object.assign(filtroHistorico, filtroBusca);
      }
    }

    const aprovadosFiltro = { ...filtroPeriodo, status: "aprovado" };
    const pendentesFiltro = { ...filtroPeriodo, status: { $ne: "aprovado" } };

    const [pixConfirmados, pixPendentes, totalRecebido, totalRegistros, transacoes] =
      await Promise.all([
        Pagamento.countDocuments(aprovadosFiltro),
        Pagamento.countDocuments(pendentesFiltro),
        Pagamento.aggregate([
          { $match: aprovadosFiltro },
          { $group: { _id: null, total: { $sum: "$valor" } } }
        ]),
        Pagamento.countDocuments(filtroHistorico),
        Pagamento.find(filtroHistorico)
          .sort({ criadoEm: -1, _id: -1 })
          .skip(pular)
          .limit(quantidadePorPagina)
      ]);

    res.json({
      periodo,
      pagamentosHoje: pixConfirmados,
      pixConfirmados,
      pixPendentes,
      totalRecebido: totalRecebido[0]?.total || 0,
      registrosTotais: pixConfirmados + pixPendentes,
      transacoes,
      paginaAtual,
      quantidadePorPagina,
      totalRegistros,
      totalPaginas: Math.ceil(totalRegistros / quantidadePorPagina)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao carregar estatísticas" });
  }
});

module.exports = router;

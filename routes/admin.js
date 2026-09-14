const express = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Merchant = require("../models/merchant");
const Assinatura = require("../models/Assinatura");
const Pagamento = require("../models/pagamento");

const router = express.Router();


// ============================================================
// VERIFICAR TOKEN
// ============================================================

function verificarToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não informado"
    });
  }

  try {

    const token = authHeader.replace(
      "Bearer ",
      ""
    );

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      erro: "Token inválido"
    });

  }

}


// ============================================================
// VERIFICAR ADMIN
// ============================================================

async function verificarAdmin(req, res, next) {

  try {

    if (
      !req.usuario ||
      req.usuario.role !== "admin"
    ) {

      return res.status(403).json({
        erro: "Acesso permitido somente ao administrador"
      });

    }

    next();

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      erro: "Erro ao verificar administrador"
    });

  }

}


// ============================================================
// MIDDLEWARE ADMIN
// ============================================================

router.use(
  verificarToken,
  verificarAdmin
);


// ============================================================
// SINCRONIZAR VENCIMENTOS
// ============================================================
//
// Aqui o sistema verifica automaticamente:
//
// PRO vencido
//      ↓
// plano = teste
// statusAssinatura = vencido
// ativo = false
//
// TESTE vencido
//      ↓
// statusAssinatura = vencido
// ativo = false
//
// ============================================================

async function sincronizarVencimentos() {

  try {

    const agora = new Date();


    // --------------------------------------------------------
    // PRO VENCIDO
    // --------------------------------------------------------

    await User.updateMany(

      {
        role: "user",

        plano: "pro",

        assinaturaExpiraEm: {
          $lt: agora
        },

        statusAssinatura: "ativo"
      },

      {
        $set: {
          plano: "teste",
          statusAssinatura: "vencido",
          ativo: false
        }
      }

    );


    // --------------------------------------------------------
    // TESTE VENCIDO
    // --------------------------------------------------------

    await User.updateMany(

      {
        role: "user",

        plano: "teste",

        testeExpiraEm: {
          $lt: agora
        },

        ativo: true
      },

      {
        $set: {
          statusAssinatura: "vencido",
          ativo: false
        }
      }

    );

  } catch (err) {

    console.error(
      "Erro ao sincronizar vencimentos:",
      err
    );

  }

}


// ============================================================
// ESTATÍSTICAS
// ============================================================

router.get(
  "/estatisticas",
  async (req, res) => {

    try {

      // Atualiza vencimentos antes de calcular
      await sincronizarVencimentos();


      const agora = new Date();


      // ------------------------------------------------------
      // TOTAL DE CLIENTES
      // ------------------------------------------------------

      const totalClientes =
        await User.countDocuments({
          role: "user"
        });


      // ------------------------------------------------------
      // CLIENTES ATIVOS
      // ------------------------------------------------------

      const clientesAtivos =
        await User.countDocuments({

          role: "user",

          ativo: true

        });


      // ------------------------------------------------------
      // CLIENTES PRO REALMENTE VÁLIDOS
      // ------------------------------------------------------

      const clientesPro =
        await User.countDocuments({

          role: "user",

          plano: "pro",

          statusAssinatura: "ativo",

          ativo: true,

          assinaturaExpiraEm: {
            $gte: agora
          }

        });


      // ------------------------------------------------------
      // CLIENTES EM TESTE
      // ------------------------------------------------------

      const clientesTeste =
        await User.countDocuments({

          role: "user",

          plano: "teste",

          ativo: true,

          $or: [

            {
              testeExpiraEm: {
                $exists: false
              }
            },

            {
              testeExpiraEm: {
                $gte: agora
              }
            }

          ]

        });


      // ------------------------------------------------------
      // ASSINATURAS PENDENTES
      // ------------------------------------------------------

      const assinaturasPendentes =
        await Assinatura.countDocuments({

          status: "pendente"

        });


      // ------------------------------------------------------
      // ASSINATURAS APROVADAS
      // ------------------------------------------------------

      const assinaturasAprovadas =
        await Assinatura.countDocuments({

          status: "aprovado"

        });


      // ------------------------------------------------------
      // RECEITA TOTAL
      // ------------------------------------------------------

      const resultado =
        await Assinatura.aggregate([

          {
            $match: {
              status: "aprovado"
            }
          },

          {
            $group: {

              _id: null,

              total: {
                $sum: "$valor"
              }

            }
          }

        ]);


      const receitaTotal =
        resultado.length > 0
          ? resultado[0].total
          : 0;


      return res.json({

        totalClientes,

        clientesAtivos,

        clientesPro,

        clientesTeste,

        assinaturasPendentes,

        assinaturasAprovadas,

        receitaTotal

      });

    } catch (err) {

      console.error(err);

      return res.status(500).json({
        erro: "Erro ao carregar estatísticas"
      });

    }

  }
);


// ============================================================
// LISTAR CLIENTES
// ============================================================

router.get(
  "/clientes",
  async (req, res) => {

    try {

      // Primeiro atualiza vencimentos
      await sincronizarVencimentos();


      const usuarios =
        await User.find({
          role: "user"
        })
        .select("-senhaHash")
        .sort({
          createdAt: -1
        })
        .lean();


      const clientes =
        await Promise.all(

          usuarios.map(
            async (usuario) => {


              // ------------------------------------------------
              // PROCURAR LOJA DO CLIENTE
              // ------------------------------------------------

              const loja =
                await Merchant.findOne({
                  userId: usuario._id
                }).lean();


              // ------------------------------------------------
              // ÚLTIMA ASSINATURA
              // ------------------------------------------------

              const assinatura =
                await Assinatura.findOne({
                  userId: usuario._id
                })
                .sort({
                  criadoEm: -1
                })
                .lean();


              // ------------------------------------------------
              // VERIFICAR SE ESTÁ VENCIDO
              // ------------------------------------------------

              let statusReal =
                usuario.statusAssinatura;

              let planoReal =
                usuario.plano;


              if (
                usuario.plano === "pro" &&
                usuario.assinaturaExpiraEm &&
                new Date(usuario.assinaturaExpiraEm) < new Date()
              ) {

                statusReal = "vencido";
                planoReal = "teste";

              }


              if (
                usuario.plano === "teste" &&
                usuario.testeExpiraEm &&
                new Date(usuario.testeExpiraEm) < new Date()
              ) {

                statusReal = "vencido";

              }


              return {

                id: usuario._id,

                nome: usuario.nome,

                email: usuario.email,

                plano: planoReal,

                statusAssinatura: statusReal,

                ativo: usuario.ativo,

                role: usuario.role,

                testeExpiraEm:
                  usuario.testeExpiraEm,

                assinaturaExpiraEm:
                  usuario.assinaturaExpiraEm,

                ultimoPagamentoEm:
                  usuario.ultimoPagamentoEm,

                createdAt:
                  usuario.createdAt,


                // ------------------------------------------------
                // LOJA
                // ------------------------------------------------

                loja: loja
                  ? {

                      id: loja._id,

                      nome: loja.nome,

                      slug: loja.slug,

                      ativo: loja.ativo

                    }

                  : null,


                // ------------------------------------------------
                // ASSINATURA
                // ------------------------------------------------

                assinatura:
                  assinatura
                    ? {

                        id: assinatura._id,

                        pagamentoId:
                          assinatura.pagamentoId,

                        valor:
                          assinatura.valor,

                        status:
                          assinatura.status,

                        criadoEm:
                          assinatura.criadoEm,

                        aprovadoEm:
                          assinatura.aprovadoEm

                      }

                    : null

              };

            }

          )

        );


      return res.json({

        sucesso: true,

        clientes

      });


    } catch (err) {

      console.error(err);

      return res.status(500).json({
        erro: "Erro ao carregar clientes"
      });

    }

  }
);


// ============================================================
// LISTAR TODAS AS LOJAS
// ============================================================
//
// IMPORTANTE:
//
// Aqui NÃO usamos somente userId.
//
// Pegamos TODAS as lojas do Merchant.
//
// Isso recupera também as lojas antigas que ficaram
// sem userId.
//
// ============================================================

router.get(
  "/lojas",
  async (req, res) => {

    try {

      const lojas =
        await Merchant.find({})
        .sort({
          _id: -1
        })
        .lean();


      const resultado =
        await Promise.all(

          lojas.map(
            async (loja) => {


              let cliente = null;


              // ------------------------------------------------
              // SE A LOJA POSSUI userId
              // ------------------------------------------------

              if (loja.userId) {

                cliente =
                  await User.findOne({
                    _id: loja.userId,
                    role: "user"
                  })
                  .select(
                    "nome email plano statusAssinatura ativo assinaturaExpiraEm testeExpiraEm"
                  )
                  .lean();

              }


              // ------------------------------------------------
              // VERIFICAR VENCIMENTO
              // ------------------------------------------------

              let statusLoja =
                cliente?.statusAssinatura || "sem assinatura";

              let planoLoja =
                cliente?.plano || "sem plano";


              if (
                cliente?.plano === "pro" &&
                cliente?.assinaturaExpiraEm &&
                new Date(cliente.assinaturaExpiraEm) < new Date()
              ) {

                statusLoja = "vencido";

                planoLoja = "teste";

              }


              return {

                id: loja._id,

                nome: loja.nome,

                slug: loja.slug,

                ativo: loja.ativo,

                userId: loja.userId || null,

                cliente: cliente
                  ? {

                      id: cliente._id,

                      nome: cliente.nome,

                      email: cliente.email,

                      plano: planoLoja,

                      statusAssinatura:
                        statusLoja,

                      ativo: cliente.ativo,

                      assinaturaExpiraEm:
                        cliente.assinaturaExpiraEm,

                      testeExpiraEm:
                        cliente.testeExpiraEm

                    }

                  : null

              };

            }

          )

        );


      return res.json({

        sucesso: true,

        totalLojas: resultado.length,

        lojas: resultado

      });


    } catch (err) {

      console.error(err);

      return res.status(500).json({

        erro: "Erro ao carregar lojas"

      });

    }

  }
);


// ============================================================
// DETALHES DE UM CLIENTE
// ============================================================

router.get(
  "/clientes/:id",
  async (req, res) => {

    try {

      await sincronizarVencimentos();


      const usuario =
        await User.findOne({

          _id: req.params.id,

          role: "user"

        })
        .select("-senhaHash")
        .lean();


      if (!usuario) {

        return res.status(404).json({
          erro: "Cliente não encontrado"
        });

      }


      const loja =
        await Merchant.findOne({
          userId: usuario._id
        }).lean();


      const assinaturas =
        await Assinatura.find({
          userId: usuario._id
        })
        .sort({
          criadoEm: -1
        })
        .lean();


      const pagamentos =
        await Pagamento.find({
          userId: usuario._id
        })
        .sort({
          _id: -1
        })
        .lean();


      return res.json({

        sucesso: true,

        cliente: {

          ...usuario,

          loja,

          assinaturas,

          pagamentos

        }

      });


    } catch (err) {

      console.error(err);

      return res.status(500).json({
        erro: "Erro ao carregar cliente"
      });

    }

  }
);


// ============================================================
// ATIVAR / DESBLOQUEAR CLIENTE
// ============================================================

router.put(
  "/clientes/:id/ativar",
  async (req, res) => {

    try {

      const usuario =
        await User.findOneAndUpdate(

          {
            _id: req.params.id,

            role: "user"
          },

          {
            ativo: true
          },

          {
            new: true
          }

        )
        .select("-senhaHash");


      if (!usuario) {

        return res.status(404).json({
          erro: "Cliente não encontrado"
        });

      }


      // ========================================================
// ATIVAR TODAS AS LOJAS VINCULADAS AO CLIENTE
// ========================================================

await Merchant.updateMany(

  {
    userId: usuario._id
  },

  {
    $set: {
      ativo: true
    }
  }

);


return res.json({

  sucesso: true,

  mensagem:
    "Cliente e loja ativados com sucesso",

  cliente: usuario

});


    } catch (err) {

      console.error(err);

      return res.status(500).json({
        erro: "Erro ao ativar cliente"
      });

    }

  }
);


// ============================================================
// BLOQUEAR CLIENTE
// ============================================================

router.put(
  "/clientes/:id/bloquear",
  async (req, res) => {

    try {

      const usuario =
        await User.findOneAndUpdate(

          {
            _id: req.params.id,

            role: "user"
          },

          {
            ativo: false
          },

          {
            new: true
          }

        )
        .select("-senhaHash");


      if (!usuario) {

        return res.status(404).json({
          erro: "Cliente não encontrado"
        });

      }


      // ========================================================
// BLOQUEAR TODAS AS LOJAS VINCULADAS AO CLIENTE
// ========================================================

await Merchant.updateMany(

  {
    userId: usuario._id
  },

  {
    $set: {
      ativo: false
    }
  }

);


return res.json({

  sucesso: true,

  mensagem:
    "Cliente e loja bloqueados com sucesso",

  cliente: usuario

});


    } catch (err) {

      console.error(err);

      return res.status(500).json({
        erro: "Erro ao bloquear cliente"
      });

    }

  }
);


// ============================================================
// ATIVAR PRO MANUALMENTE
// ============================================================

router.put(
  "/clientes/:id/pro",
  async (req, res) => {

    try {

      const dataExpiracao =
        new Date();


      dataExpiracao.setDate(
        dataExpiracao.getDate() + 30
      );


      const usuario =
        await User.findOneAndUpdate(

          {
            _id: req.params.id,

            role: "user"
          },

          {

            plano: "pro",

            statusAssinatura: "ativo",

            ativo: true,

            assinaturaExpiraEm:
              dataExpiracao,

            ultimoPagamentoEm:
              new Date()

          },

          {
            new: true
          }

        )
        .select("-senhaHash");


      if (!usuario) {

        return res.status(404).json({
          erro: "Cliente não encontrado"
        });

      }


      return res.json({

        sucesso: true,

        mensagem:
          "PRO ativado por 30 dias",

        cliente: usuario

      });


    } catch (err) {

      console.error(err);

      return res.status(500).json({
        erro: "Erro ao ativar PRO"
      });

    }

  }
);


// ============================================================
// EXPORTAR
// ============================================================

module.exports = router;
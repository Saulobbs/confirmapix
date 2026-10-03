[1mdiff --git a/server.js b/server.js[m
[1mindex 2a2737b..071f887 100644[m
[1m--- a/server.js[m
[1m+++ b/server.js[m
[36m@@ -3116,12 +3116,12 @@[m [masync function verificarStatus() {[m
             Obrigado pela sua compra.[m
           </p>[m
 [m
[31m-          <button[m
[31m-            class="novo-pix"[m
[31m-            onclick="location.href = location.pathname"[m
[31m-          >[m
[31m-            Gerar novo PIX[m
[31m-          </button>[m
[32m+[m[32m        <button[m
[32m+[m[32m  class="novo-pix"[m
[32m+[m[32m  onclick="location.href = location.pathname + '?valor=' + encodeURIComponent(valorPagamento.toFixed(2).replace('.', ','))"[m
[32m+[m[32m>[m
[32m+[m[32m  Gerar novo PIX[m
[32m+[m[32m</button>[m
 [m
         </div>[m
 [m
[36m@@ -3272,6 +3272,60 @@[m [mapp.post("/webhook", async (req, res) => {[m
 [m
     console.log("🔥 STATUS REAL:", status);[m
 [m
[32m+[m[32m    // 👤 DADOS DO PAGADOR RETORNADOS PELO MERCADO PAGO[m
[32m+[m[32mconst payer = response.data.payer || {};[m
[32m+[m
[32m+[m[32mconst nomePagador =[m
[32m+[m[32m  [payer.first_name, payer.last_name][m
[32m+[m[32m    .filter(Boolean)[m
[32m+[m[32m    .join(" ") ||[m
[32m+[m[32m  payer.name ||[m
[32m+[m[32m  "";[m
[32m+[m
[32m+[m[32mconst documentoPagador =[m
[32m+[m[32m  payer.identification?.number || "";[m
[32m+[m
[32m+[m[32mconst tipoDocumento =[m
[32m+[m[32m  payer.identification?.type || "";[m
[32m+[m
[32m+[m[32mconst emailPagador =[m
[32m+[m[32m  payer.email || "";[m
[32m+[m
[32m+[m[32m// 💾 SALVA SOMENTE OS DADOS QUE EXISTIREM[m
[32m+[m[32mconst dadosPagador = {};[m
[32m+[m
[32m+[m[32mif (nomePagador) {[m
[32m+[m[32m  dadosPagador.nomePagador = nomePagador;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mif (documentoPagador) {[m
[32m+[m[32m  dadosPagador.documentoPagador = documentoPagador;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mif (tipoDocumento) {[m
[32m+[m[32m  dadosPagador.tipoDocumento = tipoDocumento;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mif (emailPagador) {[m
[32m+[m[32m  dadosPagador.email = emailPagador;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mif (Object.keys(dadosPagador).length > 0) {[m
[32m+[m[32m  await Pagamento.updateOne([m
[32m+[m[32m    { pagamentoId: Number(paymentId) },[m
[32m+[m[32m    { $set: dadosPagador }[m
[32m+[m[32m  );[m
[32m+[m
[32m+[m[32m  console.log("👤 DADOS DO PAGADOR SALVOS:", {[m
[32m+[m[32m    nome: nomePagador || "não informado",[m
[32m+[m[32m    documento: documentoPagador || "não informado",[m
[32m+[m[32m    tipo: tipoDocumento || "não informado",[m
[32m+[m[32m    email: emailPagador || "não informado"[m
[32m+[m[32m  });[m
[32m+[m[32m} else {[m
[32m+[m[32m  console.log("⚠️ MERCADO PAGO NÃO RETORNOU DADOS DO PAGADOR");[m
[32m+[m[32m}[m
[32m+[m
     // SE APROVADO[m
    if (status === "approved") {[m
 [m
[36m@@ -3471,4 +3525,4 @@[m [mconst PORT = process.env.PORT || 3000;[m
 [m
 app.listen(PORT, () => {[m
   console.log("🚀 Rodando na porta", PORT);[m
[31m-});[m
[32m+[m[32m});[m
\ No newline at end of file[m

import { useState, useEffect } from "react";
import { getObras } from "../services.tsx";
import Header from "../components/Header/Header.tsx";
import Funcionalidades from "../components/Funcionalidades/Funcionalidades.tsx";
import Footer from "../components/Footer/Footer.tsx";
import CardContainer from "../components/CardContainer/Cardcontainer.tsx";

function Filmes() {
  const [paginaAtual, setPaginaAtual] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("page"));
  });

  const [filmes, setFilmes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function carregarFilmes() {
      setCarregando(true);
      try {
        const dados = await getObras("filmes", paginaAtual);
        setFilmes(dados);

        // Atualiza a URL para ?page=X sem recarregar a página
        const novaUrl = new URL(window.location.href);
        novaUrl.searchParams.set("page", paginaAtual.toString());
        window.history.pushState({}, "", novaUrl.toString());

        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarFilmes();
  }, [paginaAtual]);

  return (
    /* O segredo para o Footer não quebrar é esse wrapper Flexbox */
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      
      {/* O flex: 1 faz o main ocupar todo o espaço e empurrar o footer para o fundo */}
      <main style={{ flex: "1 0 auto", paddingBottom: "40px" }}>
        <Funcionalidades 
          setResultados={setFilmes} 
          nomePagina="Filmes" 
        />

        {carregando ? (
          <div style={{ textAlign: "center", padding: "100px", fontSize: "1.5rem" }}>
            <p>Carregando filmes...</p>
          </div>
        ) : (
          <>
            <CardContainer obras={filmes} type="filmes" />

            {/* CONTROLES DE PAGINAÇÃO */}
            <div style={paginationAreaStyle}>
              <button 
                disabled={paginaAtual <= 1 || carregando}
                onClick={() => setPaginaAtual(prev => prev - 1)}
                style={{ ...btnStyle, opacity: paginaAtual <= 1 ? 0.5 : 1 }}
              >
                Anterior
              </button>

              <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                Página {paginaAtual}
              </span>

              <button 
                disabled={carregando || filmes.length === 0}
                onClick={() => setPaginaAtual(prev => prev + 1)}
                style={btnStyle}
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Estilos básicos para evitar bugs visuais
const paginationAreaStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "25px",
  marginTop: "50px",
};

const btnStyle: React.CSSProperties = {
  padding: "12px 24px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "1rem",
  transition: "background 0.2s"
};

export default Filmes;
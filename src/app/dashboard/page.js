"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/dashboard.module.css";

export default function Dashboard() {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, platformsRes] = await Promise.all([
          axios.get("/api/games"),
          axios.get("/api/platforms"),
        ]);

        setGames(gamesRes.data);
        setPlatforms(platformsRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  const getPlatformName = (id) =>
    platforms.find((p) => p.id === id)?.name || "Plataforma desconocida";

  const eliminarJuego = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este juego?");
    if (!confirmar) return;

    try {
      await axios.delete(`/api/games/${id}`);
      setGames((prev) => prev.filter((juego) => juego.id !== id));
    } catch (error) {
      console.error("Error al eliminar el juego:", error);
      alert("Hubo un error al eliminar el juego.");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topBar}>
        <h1 className={styles.titulo}>Administrar videoJuegos</h1>
        <button className={styles.closeBtn} onClick={() => router.push("/login")}>✕</button>
      </div>

      <button
        className={styles.addBtn}
        onClick={() => router.push("/adiccionar")}
      >
        + Adicionar
      </button>

      <div className={styles.juegoLista}>
        {games.length === 0 ? (
          <p style={{ color: "white" }}>No hay juegos registrados aún.</p>
        ) : (
          games.map((juego) => (
            <div key={juego.id} className={styles.juegoItem}>
              <Image
                src={juego.cover || "/image.png"}
                alt={juego.title}
                width={80}
                height={80}
                className={styles.juegoImagen}
                unoptimized
              />

              <div className={styles.juegoTexto}>
                <span className={styles.plataforma}>
                  {getPlatformName(juego.platform_id)}
                </span>
                <span className={styles.nombreJuego}>{juego.title}</span>
              </div>

              <div className={styles.acciones}>
                <button
                  className={`${styles.iconButton} ${styles.ver}`}
                  onClick={() => router.push(`/consulta/${juego.id}`)}
                >
                  <Image src="/busqueda.png" alt="Ver" width={16} height={16} />
                </button>

                <button
                  className={`${styles.iconButton} ${styles.editar}`}
                  onClick={() => router.push(`/modificar/${juego.id}`)}
                >
                  <Image src="/pencil.png" alt="Editar" width={16} height={16} />
                </button>

                <button
                  className={styles.eliminar}
                  onClick={() => eliminarJuego(juego.id)}
                >
                  <Image src="/delete.png" alt="Eliminar" width={25} height={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

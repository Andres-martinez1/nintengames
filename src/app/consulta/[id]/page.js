"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import styles from "@/app/styles/consulta.module.css";
import axios from "axios";

export default function Consultar() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [juego, setJuego] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/games/${id}`);
        const game = res.data;

        const [platform, category] = await Promise.all([
          axios
            .get(`/api/platforms/${game.platform_id}`)
            .then((res) => res.data),
          axios
            .get(`/api/categories/${game.category_id}`)
            .then((res) => res.data),
        ]);

        setJuego({
          ...game,
          platform,
          category,
        });
      } catch (err) {
        console.error("Error al obtener el juego:", err);
        setError("Error al cargar el juego. Inténtalo de nuevo más tarde.");
        router.push("/not-found");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <p className={styles.loading}>Cargando...</p>;

  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.consulta}>
      <div className={styles.topBar}>
        <h1 className={styles.titulo}>
          <span className={styles.tituloParte1}>Consultar</span>{" "}
          <span className={styles.tituloParte2}>VideoJuego</span>
        </h1>
        <button
          className={styles.closeBtn}
          onClick={() => router.push("/dashboard")}
        >
          ✕
        </button>
      </div>

      <Image
        src={juego.cover ? `/uploads/${juego.cover}` : "/image.png"}
        alt={juego.title}
        width={80}
        height={80}
        className={styles.juegoImagen}
        unoptimized
      />

      <div className={styles.inputGroup}>
        <div className={styles.campo}>
          <div className={styles.label}>Título:</div>
          <div className={styles.valor}>{juego.title}</div>
        </div>
        <div className={styles.campo}>
          <div className={styles.label}>Consola:</div>
          <div className={styles.valor}>{juego.platform?.name}</div>
        </div>
        <div className={styles.campo}>
          <div className={styles.label}>Categoría:</div>
          <div className={styles.valor}>{juego.category?.name}</div>
        </div>
        <div className={styles.campo}>
          <div className={styles.label}>Año:</div>
          <div className={styles.valor}>{juego.year}</div>
        </div>
        <div className={styles.campo}>
          <div className={styles.label}>Version:</div>
          <div className={styles.valor}>{juego.version}</div>
        </div>
      </div>
    </div>
  );
}

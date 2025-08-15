"use client";

import Image from "next/image";
import styles from "@/app/styles/modificar.module.css";
import { FiCamera } from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Modificar() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [juego, setJuego] = useState(null);
  const [plataformas, setPlataformas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/games/${id}`);
        setJuego({
          ...data,
          cover: null,
        });

        if (data.cover) {
          const coverUrl = data.cover.startsWith("http")
            ? data.cover
            : `/uploads/${data.cover}`;
          setImagePreview(coverUrl);
        }
      } catch (err) {
        console.error("Error al obtener videojuego:", err);
        alert("No se pudo cargar el videojuego.");
      }

      try {
        const [platData, catData] = await Promise.all([
          axios.get("/api/platforms"),
          axios.get("/api/categories"),
        ]);
        setPlataformas(platData.data);
        setCategorias(catData.data);
      } catch (err) {
        console.error("Error al obtener plataformas/categorías:", err);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    setJuego({ ...juego, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setJuego({ ...juego, cover: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleModificar = async (e) => {
    e.preventDefault();

    if (
      !juego?.title ||
      !juego?.platform_id ||
      !juego?.category_id ||
      !juego?.year
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", juego.title);
      formData.append("platform_id", juego.platform_id);
      formData.append("category_id", juego.category_id);
      formData.append("year", juego.year);
      if (juego.version) formData.append("version", juego.version);
      if (juego.cover instanceof File) {
        formData.append("cover", juego.cover);
      }

      await axios.put(`/api/games/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Juego modificado exitosamente");
      router.push("/dashboard");
    } catch (error) {
      console.error(
        "Error al modificar:",
        error.response?.data || error.message
      );
      alert("Error al modificar. Verifica consola.");
    }
  };

  if (!juego) return <p>Cargando...</p>;

  return (
    <div className={styles.modificar}>
      <div className={styles.topBar}>
        <h1 className={styles.titulo}>
          <span className={styles.tituloParte1}>Modificar</span>{" "}
          <span className={styles.tituloParte2}>VideoJuego</span>
        </h1>
        <button
          className={styles.closeBtn}
          onClick={() => router.push("/dashboard")}
        >
          ✕
        </button>
      </div>

      {imagePreview && (
        <Image
          src={imagePreview}
          alt="Portada"
          width={180}
          height={180}
          className={styles.juegoImagen}
        />
      )}

      <div className={styles.inputGroup}>
        <input
          type="text"
          className={styles.input}
          name="title"
          value={juego.title || ""}
          onChange={handleInputChange}
        />

        <select
          className={styles.select}
          name="platform_id"
          value={juego.platform_id || ""}
          onChange={handleInputChange}
        >
          <option value="">Seleccione plataforma</option>
          {plataformas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          name="category_id"
          value={juego.category_id || ""}
          onChange={handleInputChange}
        >
          <option value="">Seleccione categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label className={styles.fileInputLabel}>
          Cambiar Portada
          <FiCamera className={styles.iconoCamaraDerecha} />
          <input
            type="file"
            className={styles.fileInput}
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        <input
          className={styles.input}
          name="year"
          type="number"
          value={juego.year || ""}
          onChange={handleInputChange}
          placeholder="Año de lanzamiento"
        />

        <input
          className={styles.input}
          name="version"
          type="text"
          value={juego.version || ""}
          onChange={handleInputChange}
          placeholder="Versión"
        />

        <button className={styles.boton} onClick={handleModificar}>
          Modificar
        </button>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import styles from "../styles/adiccionar.module.css";
import { FiCamera } from "react-icons/fi";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function FormAgregar() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    platform_id: "",
    category_id: "",
    year: "",
    version: "",
  });

  const [coverFile, setCoverFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [platformsRes, categoriesRes] = await Promise.all([
          axios.get("/api/platforms"),
          axios.get("/api/categories"),
        ]);
        setPlatforms(platformsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error cargando plataformas/categorías:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.platform_id || !form.category_id || !form.year || !coverFile) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("platform_id", form.platform_id);
      formData.append("category_id", form.category_id);
      formData.append("year", form.year);
      formData.append("version", form.version);
      formData.append("cover", coverFile);

      await axios.post("/api/games", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Juego guardado correctamente.");
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Error al guardar el juego:", err);
      alert("Error al guardar el juego. Intenta de nuevo.");
    }
  };

  return (
    <div className={styles.adiccionar}>
      <div className={styles.topBar}>
        <h1 className={styles.titulo}>
          <span className={styles.tituloParte1}>Adicionar</span>{" "}
          <span className={styles.tituloParte2}>VideoJuego</span>
        </h1>
        <button className={styles.closeBtn} onClick={() => router.push("/dashboard")}>
          ✕
        </button>
      </div>

      <img
        src={imagePreview || "/image.png"}
        alt="Preview"
        width={180}
        height={180}
        className={styles.juegoImagen}
      />

      <form className={styles.inputGroup} onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          className={styles.input}
        />

        <select
          name="platform_id"
          value={form.platform_id}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="" disabled hidden>
            Selecciona Consola...
          </option>
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </select>

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="" disabled hidden>
            Selecciona Categoría...
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label htmlFor="cover" className={styles.fileInputLabel}>
          Subir Portada
          <FiCamera className={styles.iconoCamaraDerecha} />
          <input
            type="file"
            id="cover"
            name="cover"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
        </label>

        <input
          name="version"
          placeholder="Versión"
          value={form.version}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="year"
          placeholder="Año"
          value={form.year}
          onChange={handleChange}
          className={styles.input}
        />

        <button type="submit" className={styles.boton}>
          Guardar
        </button>
      </form>
    </div>
  );
}

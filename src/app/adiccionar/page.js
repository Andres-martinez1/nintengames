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
    cover: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const platformsRes = await axios.get("/api/platforms");
      const categoriesRes = await axios.get("/api/categories");
      setPlatforms(platformsRes.data);
      setCategories(categoriesRes.data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, cover: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("platform_id", form.platform_id);
    formData.append("category_id", form.category_id);
    formData.append("year", form.year);
    formData.append("version", form.version);
    formData.append("cover", form.cover);

    try {
      await axios.post("/api/games", formData);
      alert("Juego guardado correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error al guardar.");
    }
  };

  return (
    <div className={styles.adiccionar}>
      <div className={styles.topBar}>
        <h1 className={styles.titulo}>
          <span className={styles.tituloParte1}>Adiccionarr</span>{" "}
          <span className={styles.tituloParte2}>VideoJuego</span>
        </h1>
        <button
          className={styles.closeBtn}
          onClick={() => router.push("/dashboard")}
        >
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
          placeholder="version"
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

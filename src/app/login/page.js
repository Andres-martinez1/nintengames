"use client";
import styles from "../styles/login.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; 

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const { token } = response.data;

      Cookies.set("token", token, {
        expires: 1, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al iniciar sesión");
      } else {
        setError("Error inesperado");
      }
    }
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.titulo}>
        <span className={styles.ninten}>ninten</span>
        <span className={styles.games}>games</span>
      </h1>

      <img src="/Mario.png" className={styles.img} alt="Mario" />

      <input
        className={styles.email}
        placeholder="Correo Electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className={styles.password}
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.boton} onClick={handleLogin}>
        Ingresar
      </button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Package, Truck, Repeat, Sun } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Splide imports
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const Inicio = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [rolUsuario, setRolUsuario] = useState(""); // estado para el rol
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.nombre) setNombreUsuario(user.nombre);
    else setNombreUsuario("Usuario");

    if (user && user.rol) setRolUsuario(user.rol); // guardamos el rol
  }, []);

  // Todos los botones posibles
  const botones = [
    { nombre: "Usuarios", icono: <Users size={32} />, ruta: "/usuarios", color: "bg-blue-500", roles: ["admin"] },
    { nombre: "Productos", icono: <Package size={32} />, ruta: "/productos", color: "bg-green-500", roles: ["admin", "vendedor"] },
    { nombre: "Proveedores", icono: <Truck size={32} />, ruta: "/proveedores", color: "bg-yellow-500", roles: ["admin", "vendedor"] },
    { nombre: "Movimientos", icono: <Repeat size={32} />, ruta: "/movimientos", color: "bg-purple-500", roles: ["admin", "vendedor"] },
    { nombre: "Dashboard", icono: <Sun size={32} />, ruta: "/dashboard", color: "bg-red-500", roles: ["admin"] },
    { nombre: "Categorías", icono: <Package size={32} />, ruta: "/categorias", color: "bg-indigo-500", roles: ["admin", "vendedor"] },
  ];

  // Filtramos los botones según el rol
  const botonesFiltrados = botones.filter((btn) => btn.roles.includes(rolUsuario));

  // Frases motivadoras
  const frasesMotivadoras = [
    "No dejes que lo que no puedes hacer interfiera con lo que puedes hacer.",
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "Cree en ti mismo y todo será posible.",
    "La disciplina es el puente entre metas y logros.",
  ];

  const generarFrase = () => {
    const index = Math.floor(Math.random() * frasesMotivadoras.length);
    MySwal.fire({
      title: "Frase del Día 😊",
      text: frasesMotivadoras[index],
      icon: "success",
      confirmButtonText: "Cerrar",
      confirmButtonColor: "#facc15",
    });
  };

  // Slides de tutoriales
  const slidesTutorial = [
    {
      titulo: "Tutorial Administrador",
      descripcion:
        "Aprende a gestionar usuarios, productos, proveedores y movimientos dentro del sistema Quantika.",
      videoId: "NmEyGiaqm7k",
    },
    {
      titulo: "Tutorial Vendedor",
      descripcion:
        "Guía rápida para realizar ventas, consultar stock y manejar los registros relacionados al área comercial.",
      videoId: "NmEyGiaqm7k",
    },
  ];

  // Slides de consejos
  const slidesConsejos = [
    {
      titulo: "Gestión de Productos",
      contenido: [
        "Mantén el nombre del producto claro y sin duplicados.",
        "Actualiza el stock apenas ingresen o salgan unidades.",
        "Verifica los precios para evitar diferencias.",
        "Asocia cada producto a su proveedor correspondiente.",
      ],
    },
    {
      titulo: "Control de Proveedores",
      contenido: [
        "Registra datos de contacto correctos.",
        "Revisa su historial de entregas.",
        "Asocia productos a cada proveedor.",
        "Evita duplicados al registrar.",
      ],
    },
    {
      tipo: "listado",
      titulo: "Buenas Prácticas",
      contenido: [
        "Realiza copias de seguridad de la base de datos semanalmente.",
        "Cierra sesión si compartes la computadora.",
        "No borres registros sin revisar las dependencias.",
        "Mantén tus datos organizados para evitar errores."
      ]
    }
  ];

  return (
    <div className="p-8 space-y-12">

      {/* Card superior */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Bienvenido {nombreUsuario} a Quantika
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 italic">
            Quantika, tu sistema de inventario de confianza
          </p>
        </div>
        <button
          onClick={generarFrase}
          className="flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition transform hover:scale-105"
        >
          <Sun size={20} className="mr-2" />
          Frase del Día
        </button>
      </div>

      {/* Botones rápidos filtrados por rol */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {botonesFiltrados.map((btn) => (
          <div
            key={btn.nombre}
            onClick={() => navigate(btn.ruta)}
            className={`cursor-pointer flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg hover:scale-105 transform transition ${btn.color} text-white`}
          >
            {btn.icono}
            <span className="mt-4 text-lg font-semibold">{btn.nombre}</span>
          </div>
        ))}
      </div>

      {/* 2 Cards horizontales: Tutoriales y Consejos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* CARD 1 - TUTORIALES */}
        <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <Splide
            options={{
              type: "loop",
              perPage: 1,
              focus: "center",
              gap: "2rem",
              padding: { left: "2rem", right: "2rem" },
              arrows: true,
              pagination: true,
            }}
          >
            {slidesTutorial.map((s, idx) => (
              <SplideSlide key={idx}>
                <div className="relative bg-gradient-to-br from-purple-300 via-purple-400 to-purple-600
                  p-6 rounded-xl shadow-xl w-full h-96 max-w-xl mx-auto text-white
                  flex flex-col items-center justify-center">

                  <h3 className="text-2xl font-bold text-center mb-4">{s.titulo}</h3>

                  <p className="text-center mb-6 px-6 text-white/90 font-medium text-sm">
                    {s.descripcion}
                  </p>

                  <button
                    onClick={() => window.open(`https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1=${s.videoId}`, "_blank")}
                    className="flex items-center gap-3 bg-white/20 backdrop-blur-md 
                               px-6 py-3 rounded-xl text-white font-semibold shadow-lg
                               hover:bg-white/30 hover:scale-105 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Ver Video
                  </button>

                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>

        {/* CARD 2 - CONSEJOS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <Splide
            options={{
              type: "loop",
              perPage: 1,
              focus: "center",
              gap: "2rem",
              padding: { left: "2rem", right: "2rem" },
              arrows: true,
              pagination: true,
            }}
          >
            {slidesConsejos.map((s, idx) => (
              <SplideSlide key={idx}>
                <div className="relative bg-gradient-to-br from-green-300 via-green-400 to-green-500
                                p-6 rounded-xl shadow-xl w-full h-96 max-w-xl mx-auto text-white">

                  <h3 className="text-2xl font-bold text-center mb-4">{s.titulo}</h3>

                  <div className="space-y-3">
                    {s.contenido.map((tip, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-white/20 backdrop-blur-md 
                                   p-3 rounded-lg shadow-md border border-white/30
                                   hover:bg-white/30 hover:scale-[1.02] transition cursor-default"
                      >
                        <div className="w-8 h-8 flex items-center justify-center bg-white/50 text-green-900 rounded-full font-bold shadow">
                          {i + 1}
                        </div>

                        <p className="text-white text-sm font-medium">{tip}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>

      </div>
    </div>
  );
};

export default Inicio;

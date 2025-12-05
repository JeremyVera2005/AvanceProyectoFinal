// src/pages/Movimientos.jsx
import React, { useEffect, useState } from "react";
import movimientoService from "../services/movimientoService";
import productoService from "../services/productoService";
import { Search, Package, FileText, Hash, Printer, Eye } from "lucide-react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({
    id: null,
    productoId: "",
    proveedor: "",
    tipo: "",
    cantidad: "",
    detalle: "",
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const cargarDatos = async () => {
    try {
      const [m, p] = await Promise.all([
        movimientoService.getAll(),
        productoService.getAll(),
      ]);
      setMovimientos(m);
      setProductos(p);
    } catch (err) {
      console.error("❌ Error al cargar datos:", err);
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleProductoChange = (productoId) => {
    const producto = productos.find((p) => p.id === parseInt(productoId));
    if (producto && form.tipo === "Ingreso") {
      const listaProveedores = [producto.proveedor1, producto.proveedor2].filter(Boolean);
      const proveedorActual = listaProveedores.includes(form.proveedor)
        ? form.proveedor
        : "";
      setProveedores(listaProveedores);
      setForm({ ...form, productoId, proveedor: proveedorActual });
    } else {
      setProveedores([]);
      setForm({ ...form, productoId, proveedor: "" });
    }
  };

  const handleTipoChange = (tipo) => {
    if (tipo === "Ingreso" && form.productoId) {
      const producto = productos.find((p) => p.id === parseInt(form.productoId));
      const listaProveedores = producto
        ? [producto.proveedor1, producto.proveedor2].filter(Boolean)
        : [];
      const proveedorActual = listaProveedores.includes(form.proveedor)
        ? form.proveedor
        : "";
      setProveedores(listaProveedores);
      setForm({ ...form, tipo, proveedor: proveedorActual });
    } else {
      setProveedores([]);
      setForm({ ...form, tipo, proveedor: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.productoId ||
      !form.tipo ||
      !form.cantidad ||
      (form.tipo === "Ingreso" && !form.proveedor)
    ) {
      Swal.fire(
        "Campos vacíos",
        "⚠️ Todos los campos obligatorios deben completarse",
        "warning"
      );
      return;
    }

    const producto = productos.find((p) => p.id === parseInt(form.productoId));
    if (!producto) {
      Swal.fire("Error", "Producto no encontrado", "error");
      return;
    }

    const payload = {
      productoNombre: producto.nombre,
      proveedor: form.tipo === "Ingreso" ? form.proveedor : "",
      tipo: form.tipo,
      cantidad: parseInt(form.cantidad),
      detalle: form.detalle,
    };

    try {
      if (editId) {
        await movimientoService.update(editId, payload);
        Swal.fire("Actualizado", "✏️ Movimiento actualizado correctamente", "success");
        setEditId(null);
      } else {
        await movimientoService.create(payload);
        Swal.fire("Creado", "✅ Movimiento registrado con éxito", "success");
      }
      setForm({ id: null, productoId: "", proveedor: "", tipo: "", cantidad: "", detalle: "" });
      setProveedores([]);
      cargarDatos();
    } catch (err) {
      console.error("❌ Error guardando movimiento:", err);
      Swal.fire("Error", "No se pudo guardar el movimiento", "error");
    }
  };

  const handleEdit = (mov) => {
    const producto = productos.find((p) => p.nombre === mov.producto_nombre);
    if (mov.tipo === "Ingreso" && producto) {
      const listaProveedores = [producto.proveedor1, producto.proveedor2].filter(Boolean);
      setProveedores(listaProveedores);
      setForm({
        productoId: producto.id,
        proveedor: listaProveedores.includes(mov.proveedor) ? mov.proveedor : "",
        tipo: mov.tipo,
        cantidad: mov.cantidad,
        detalle: mov.detalle || "",
      });
    } else {
      setProveedores([]);
      setForm({
        productoId: producto ? producto.id : "",
        proveedor: "",
        tipo: mov.tipo,
        cantidad: mov.cantidad,
        detalle: mov.detalle || "",
      });
    }
    setEditId(mov.id);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ id: null, productoId: "", proveedor: "", tipo: "", cantidad: "", detalle: "" });
    setProveedores([]);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Eliminar movimiento?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await movimientoService.remove(id);
          Swal.fire("Eliminado", "🗑️ Movimiento eliminado", "success");
          cargarDatos();
        } catch (err) {
          console.error("❌ Error eliminando:", err);
          Swal.fire("Error", "No se pudo eliminar el movimiento", "error");
        }
      }
    });
  };

  const handleImprimir = async (mov) => {
    const { value: datos } = await Swal.fire({
      title: mov.tipo === "Ingreso" ? "Datos del proveedor" : "Datos del cliente",
      html: `
        <input id="swal-nombre" class="swal2-input" placeholder="Nombre ${
          mov.tipo === "Ingreso" ? "proveedor" : "cliente"
        }" value="${mov.tipo === "Ingreso" ? mov.proveedor : ""}">
        <select id="swal-tipo" class="swal2-input">
          ${
            mov.tipo === "Ingreso"
              ? `<option value="RUC">RUC Proveedor</option>
                 <option value="DNI">DNI Proveedor</option>`
              : `<option value="DNI">DNI Cliente</option>
                 <option value="RUC">RUC Cliente</option>`
          }
        </select>
        <input id="swal-valor" class="swal2-input" placeholder="Ingrese valor">`,
      focusConfirm: false,
      preConfirm: () => ({
        nombre: document.getElementById("swal-nombre").value,
        tipo: document.getElementById("swal-tipo").value,
        valor: document.getElementById("swal-valor").value,
      }),
    });

    if (!datos) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("QUANTIKA S.A.C", 14, 20);
    doc.setFontSize(10);
    doc.text("RUC: 20123456789", 14, 26);
    doc.text("Dirección: Av. Inventada 123, Lima - Perú", 14, 32);
    doc.text("Tel: (01) 123-4567", 14, 38);

    doc.setFontSize(14);
    doc.text(
      mov.tipo === "Ingreso"
        ? "GUÍA DE REMISIÓN DE ENTRADA"
        : "GUÍA DE REMISIÓN DE SALIDA",
      105,
      50,
      { align: "center" }
    );

    doc.setFontSize(10);
    doc.text(`Nombre: ${datos.nombre}`, 14, 60);
    doc.text(`${datos.tipo}: ${datos.valor}`, 14, 66);
    doc.text(`Fecha: ${new Date(mov.fecha).toLocaleString()}`, 14, 72);

    autoTable(doc, {
      startY: 80,
      head: [["Producto", "Cantidad", "Detalle", "Proveedor/Cliente"]],
      body: [[mov.producto_nombre, mov.cantidad, mov.detalle || "-", datos.nombre || "-"]],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      theme: "grid",
    });

    const finalY = doc.lastAutoTable.finalY + 20;
    doc.text("_________________________", 14, finalY);
    doc.text("Firma almacén", 14, finalY + 5);
    doc.text("_________________________", 140, finalY);
    doc.text("Firma receptor", 140, finalY + 5);

    doc.setFontSize(9);
    doc.text("Documento generado desde el sistema Quantika", 14, finalY + 20);

    doc.save(`${mov.tipo === "Ingreso" ? "Entrada" : "Salida"}_${mov.producto_nombre}.pdf`);
  };

  const movimientosFiltrados = movimientos.filter(
    (m) =>
      `${m.tipo} ${m.cantidad} ${m.detalle || ""} ${m.producto_nombre || ""} ${
        m.proveedor || ""
      }`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <section className="mt-6 p-6 space-y-6">
      {/* Encabezado */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">Gestión de Movimientos</h2>
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full md:w-80">
          <Search className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Buscar movimiento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-gray-700"
          />
        </div>
        <button
          onClick={() => {
            setForm({ id: null, productoId: "", proveedor: "", tipo: "", cantidad: "", detalle: "" });
            setEditId(null);
            setProveedores([]);
          }}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <i className="fa-solid fa-plus"></i> Nuevo Movimiento
        </button>
      </div>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Formulario */}
        <div className="md:w-1/3 bg-white rounded-2xl shadow p-5">
          <h5 className="text-lg font-semibold mb-4">{editId ? "Editar Movimiento" : "Nuevo Movimiento"}</h5>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Producto */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <Package className="text-gray-500 mr-3" size={20} />
              <select
                value={form.productoId}
                onChange={(e) => handleProductoChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              >
                <option value="">Seleccione un producto</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Proveedor */}
            {form.tipo === "Ingreso" && proveedores.length > 0 && (
              <div className="flex items-center border-b border-gray-300 py-2">
                <FileText className="text-gray-500 mr-3" size={20} />
                <select
                  value={form.proveedor}
                  onChange={(e) => setForm({ ...form, proveedor: e.target.value })}
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                >
                  <option value="">Seleccione proveedor</option>
                  {proveedores.map((prov, i) => (
                    <option key={i} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Tipo */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <FileText className="text-gray-500 mr-3" size={20} />
              <select
                value={form.tipo}
                onChange={(e) => handleTipoChange(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-gray-700"
              >
                <option value="">Seleccione tipo</option>
                <option value="Ingreso">Ingreso</option>
                <option value="Salida">Salida</option>
              </select>
            </div>

            {/* Cantidad */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <Hash className="text-gray-500 mr-3" size={20} />
              <input
                type="number"
                min="1"
                value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                placeholder="Cantidad"
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>

            {/* Detalle */}
            <div className="flex items-center border-b border-gray-300 py-2">
              <FileText className="text-gray-500 mr-3" size={20} />
              <input
                type="text"
                value={form.detalle}
                onChange={(e) => setForm({ ...form, detalle: e.target.value })}
                placeholder="Detalle (opcional)"
                className="w-full bg-transparent focus:outline-none text-gray-700"
              />
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-2 mt-4">
              <button
                type="submit"
                className={`w-full text-white py-2 rounded-lg ${
                  editId ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {editId ? "Actualizar" : "Guardar"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla */}
        <div className="md:w-2/3 bg-white rounded-2xl shadow p-5">
          <h5 className="text-lg font-semibold mb-4">Listado de Movimientos</h5>
          <div className="overflow-y-auto max-h-[400px] border rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-emerald-600 text-white z-10">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2">Cantidad</th>
                  <th className="px-3 py-2">Detalle</th>
                  <th className="px-3 py-2">Proveedor</th>
                  <th className="px-3 py-2">Fecha</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {movimientosFiltrados.length > 0 ? (
                  movimientosFiltrados.map((m, i) => (
                    <tr
                      key={m.id}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-emerald-50`}
                    >
                      <td className="px-3 py-2">{m.id}</td>
                      <td className="px-3 py-2">{m.producto_nombre || "—"}</td>
                      <td className="px-3 py-2">{m.tipo}</td>
                      <td className="px-3 py-2">{m.cantidad}</td>
                            {/* DETALLE CON DISEÑO MODERNO EN SWEETALERT */}
                            <td className="px-3 py-2 text-center">
                              {m.detalle && (
                                <button
                                  onClick={() =>
                                    Swal.fire({
                                      title: `<strong>Detalle de ${m.producto_nombre}</strong>`,
                                      html: `
                                        <div style="display:flex; flex-direction:column; gap:12px; text-align:left;">
                                          <div style="border:1px solid #e5e7eb; padding:12px; border-radius:0.5rem; box-shadow:0 1px 2px rgba(0,0,0,0.05);">
                                            <h4 style="font-weight:600; color:#6b7280; margin-bottom:4px;">Detalle</h4>
                                            <p style="color:#374151;">${m.detalle || "-"}</p>
                                          </div>
                                        </div>
                                      `,
                                      confirmButtonText: 'Cerrar',
                                      width: 400,
                                      customClass: {
                                        popup: 'rounded-3xl p-4',
                                        title: 'text-lg font-bold',
                                        confirmButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg px-4 py-2'
                                      }
                                    })
                                  }
                                >
                                  <Eye size={20} className="text-black mx-auto" />
                                </button>
                              )}
                            </td>
                      <td className="px-3 py-2">{m.proveedor || "—"}</td>
                      <td className="px-3 py-2">{m.fecha}</td>
                      <td className="px-3 py-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(m)}
                          className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="bg-rose-600 text-white px-3 py-1 rounded hover:bg-rose-700"
                        >
                          Borrar
                        </button>
                        <button
                          onClick={() => handleImprimir(m)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Printer size={16} /> Imprimir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">
                      No hay movimientos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Movimientos;

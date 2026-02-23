import express from "express";
import mercadopago from "mercadopago";

const app = express();
app.use(express.json());

mercadopago.configure({
  access_token: "TU_ACCESS_TOKEN_DE_MERCADO_PAGO"
});

app.post("/crear-preferencia", async (req, res) => {
  const carrito = req.body.carrito;

  const items = carrito.map(p => ({
    title: p.nombre,
    quantity: p.cantidad,
    unit_price: p.precio,
    currency_id: "COP"
  }));

  const preference = {
    items,
    back_urls: {
      success: "http://localhost:5500/exito.html",
      failure: "http://localhost:5500/error.html",
      pending: "http://localhost:5500/pendiente.html"
    },
    auto_return: "approved"
  };

  const response = await mercadopago.preferences.create(preference);
  res.json({ id: response.body.id });
});

app.listen(3000, () => {
  console.log("Servidor activo en http://localhost:3000");
});

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed inicial idempotente para catalogos, usuarios demo y activos base.
  const cargos = await Promise.all(
    ["Administrador", "Tecnico", "Consulta", "Administrativo"].map((NombreRol) =>
      prisma.cargos.upsert({
        where: { NombreRol },
        update: {},
        create: { NombreRol },
      }),
    ),
  );

  const dimensiones = await Promise.all(
    [
      { NumeroDimension: "1001", NombreDimension: "Casa Matriz" },
      { NumeroDimension: "1002", NombreDimension: "Megatienda" },
      { NumeroDimension: "1003", NombreDimension: "Bodega Central" },
      { NumeroDimension: "2001", NombreDimension: "Peru Benavides" },
    ].map((dimension) =>
      prisma.dimensiones.upsert({
        where: { NumeroDimension: dimension.NumeroDimension },
        update: {},
        create: dimension,
      }),
    ),
  );

  const cuentas = await Promise.all(
    ["Office", "SAP", "TPV", "VPN", "Correo", "Adobe"].map((NombreCuenta) =>
      prisma.cuenta.upsert({
        where: { NombreCuenta },
        update: {},
        create: { NombreCuenta },
      }),
    ),
  );

  const marcas = await Promise.all(
    ["HP", "Lenovo", "Dell", "Apple", "Ubiquiti", "Epson", "Brother"].map((NombreMarca) =>
      prisma.marcas.upsert({
        where: { NombreMarca },
        update: {},
        create: { NombreMarca },
      }),
    ),
  );

  const marcaByName = Object.fromEntries(marcas.map((marca) => [marca.NombreMarca, marca]));
  const modelos = await Promise.all(
    [
      { NombreModelo: "ProBook", IdMarca: marcaByName.HP.IdMarca },
      { NombreModelo: "ThinkPad", IdMarca: marcaByName.Lenovo.IdMarca },
      { NombreModelo: "Latitude", IdMarca: marcaByName.Dell.IdMarca },
      { NombreModelo: "MacBook Pro", IdMarca: marcaByName.Apple.IdMarca },
      { NombreModelo: "iMac", IdMarca: marcaByName.Apple.IdMarca },
      { NombreModelo: "UniFi AP", IdMarca: marcaByName.Ubiquiti.IdMarca },
    ].map((modelo) =>
      prisma.modelos.upsert({
        where: { IdMarca_NombreModelo: { IdMarca: modelo.IdMarca, NombreModelo: modelo.NombreModelo } },
        update: {},
        create: modelo,
      }),
    ),
  );

  const procesadores = await Promise.all(
    ["Intel Core i5", "Intel Core i7", "AMD Ryzen 5", "Apple M1", "Apple M2"].map((NombreProcesador) =>
      prisma.procesadores.upsert({
        where: { NombreProcesador },
        update: {},
        create: { NombreProcesador },
      }),
    ),
  );

  const discos = await Promise.all(
    [
      { TipoDisco: "SSD", CapacidadGB: 256, Descripcion: "SSD 256GB" },
      { TipoDisco: "SSD", CapacidadGB: 512, Descripcion: "SSD 512GB" },
      { TipoDisco: "SSD", CapacidadGB: 1024, Descripcion: "SSD 1TB" },
      { TipoDisco: "HDD", CapacidadGB: 1024, Descripcion: "HDD 1TB" },
      { TipoDisco: "NVMe", CapacidadGB: 512, Descripcion: "NVMe 512GB" },
    ].map((disco) => prisma.discosDuros.create({ data: disco })),
  );

  const estados = await Promise.all(
    ["Disponible", "Asignado", "En reparacion", "Dado de baja", "Perdido"].map((NombreEstado) =>
      prisma.estadosActivo.upsert({
        where: { NombreEstado },
        update: {},
        create: { NombreEstado },
      }),
    ),
  );

  const demoHash = await bcrypt.hash("Demo1234!", 10);
  void demoHash;

  const admin = await prisma.usuarios.create({
    data: {
      NombreUsuario: "Admin",
      ApellidoPaterno: "Sistema",
      FechaIngreso: new Date("2024-01-01"),
      IdCargo: cargos[0].IdRol,
      IdDimension: dimensiones[0].IdDimension,
      IdCuenta: cuentas[0].IdCuenta,
    },
  });

  const usuario = await prisma.usuarios.create({
    data: {
      NombreUsuario: "Usuario",
      ApellidoPaterno: "Normal",
      FechaIngreso: new Date("2024-02-01"),
      IdCargo: cargos[3].IdRol,
      IdDimension: dimensiones[1].IdDimension,
      IdCuenta: cuentas[4].IdCuenta,
    },
  });

  const modeloByName = Object.fromEntries(modelos.map((modelo) => [modelo.NombreModelo, modelo]));
  const estadoByName = Object.fromEntries(estados.map((estado) => [estado.NombreEstado, estado]));
  const procByName = Object.fromEntries(procesadores.map((procesador) => [procesador.NombreProcesador, procesador]));
  const discoByDesc = Object.fromEntries(discos.map((disco) => [disco.Descripcion, disco]));

  await Promise.all(
    [
      {
        IdDimension: dimensiones[0].IdDimension,
        IdUsuario: admin.IdUsuario,
        RAM: "16GB",
        IdMarca: marcaByName.HP.IdMarca,
        IdModelo: modeloByName.ProBook.IdModelo,
        IdProcesador: procByName["Intel Core i5"].IdProcesador,
        IdDiscoDuro: discoByDesc["SSD 512GB"].IdDiscoDuro,
        Serial: "HP-PROBOOK-DEMO-001",
        NumeroFactura: "FAC-1001",
        RutProveedor: "76000000-0",
        FechaCompra: new Date("2025-01-15"),
        Detalles: "Notebook HP asignado a usuario",
        EsAF: true,
        IdEstadoActivo: estadoByName.Asignado.IdEstadoActivo,
      },
      {
        IdDimension: dimensiones[2].IdDimension,
        RAM: null,
        IdMarca: marcaByName.Epson.IdMarca,
        IdModelo: modeloByName.ProBook.IdModelo,
        Serial: "EPSON-DEMO-001",
        Detalles: "Impresora asignada solo a dimension",
        EsAF: true,
        IdEstadoActivo: estadoByName.Disponible.IdEstadoActivo,
      },
      {
        IdDimension: dimensiones[2].IdDimension,
        IdMarca: marcaByName.Ubiquiti.IdMarca,
        IdModelo: modeloByName["UniFi AP"].IdModelo,
        Serial: "UBNT-AP-DEMO-001",
        Detalles: "Equipo Ubiquiti asignado solo a dimension",
        EsAF: true,
        IdEstadoActivo: estadoByName.Disponible.IdEstadoActivo,
      },
      {
        IdDimension: dimensiones[1].IdDimension,
        IdUsuario: usuario.IdUsuario,
        RAM: "16GB",
        IdMarca: marcaByName.Apple.IdMarca,
        IdModelo: modeloByName["MacBook Pro"].IdModelo,
        IdProcesador: procByName["Apple M2"].IdProcesador,
        IdDiscoDuro: discoByDesc["NVMe 512GB"].IdDiscoDuro,
        Serial: "MBP-DEMO-001",
        Detalles: "MacBook asignado a usuario",
        EsAF: true,
        IdEstadoActivo: estadoByName.Asignado.IdEstadoActivo,
      },
      {
        IdDimension: dimensiones[0].IdDimension,
        IdMarca: marcaByName.Lenovo.IdMarca,
        IdModelo: modeloByName.ThinkPad.IdModelo,
        Serial: "CHIP-BKP-DEMO-001",
        Detalles: "Chip BKP sin usuario, solo dimension",
        EsAF: false,
        IdEstadoActivo: estadoByName.Disponible.IdEstadoActivo,
      },
    ].map((activo) =>
      prisma.activoFijo.upsert({
        where: { Serial: activo.Serial },
        update: {},
        create: activo,
      }),
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

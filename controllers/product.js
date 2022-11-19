const ProductModel = require("../models/product");
const UserModel = require("../models/user");

const { sendError } = require("../utils/helper");
const { isValidObjectId } = require("mongoose");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

exports.createProduct = async (req, res) => {
  const {
    cabang,
    harga,
    kategori,
    status_produk,
    tanggal_mulai,
    tanggal_selesai,
    waktu_mulai,
    waktu_selesai,
    status_lelang,
    no_lot,
    kondisi_mesin,
    kondisi_exterior,
    kondisi_interior,
    model_produk,
    tahun_produk,
    transmisi,
    no_rangka,
    no_mesin,
    merk_produk,
    kapasitas_mesin,
    odometer,
    catatan,
    no_polisi,
    warna,
    stnk,
    exp_stnk,
    faktur,
    ktp,
    kwitansi,
    form_A,
    sph,
    keur,
    bpkb,
  } = req.body;
  const { file } = req;

  const newProduct = new ProductModel({
    cabang,
    harga,
    kategori,
    status_produk,
    tanggal_mulai,
    tanggal_selesai,
    waktu_mulai,
    waktu_selesai,
    status_lelang,
    no_lot,
    kondisi_mesin,
    kondisi_exterior,
    kondisi_interior,
    model_produk,
    tahun_produk,
    transmisi,
    no_rangka,
    no_mesin,
    merk_produk,
    kapasitas_mesin,
    odometer,
    catatan,
    no_polisi,
    warna,
    stnk,
    exp_stnk,
    faktur,
    ktp,
    kwitansi,
    form_A,
    sph,
    keur,
    bpkb,
  });

  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { gravity: "face", height: 480, width: 640, crop: "thumb" }
    );

    newProduct.avatar = { url: secure_url, public_id };
  }

  await newProduct.save();

  res.status(201).json({
    id: newProduct._id,
    cabang,
    harga,
    kategori,
    status_produk,
    tanggal_mulai,
    tanggal_selesai,
    waktu_mulai,
    waktu_selesai,
    status_lelang,
    no_lot,
    kondisi_mesin,
    kondisi_exterior,
    kondisi_interior,
    model_produk,
    tahun_produk,
    transmisi,
    no_rangka,
    no_mesin,
    merk_produk,
    kapasitas_mesin,
    odometer,
    catatan,
    no_polisi,
    warna,
    stnk,
    exp_stnk,
    faktur,
    ktp,
    kwitansi,
    form_A,
    sph,
    keur,
    bpkb,
    avatar: newProduct.avatar?.url,
  });
};

exports.updateProduct = async (req, res) => {
  const {
    cabang,
    harga,
    kategori,
    status_produk,
    tanggal_mulai,
    tanggal_selesai,
    waktu_mulai,
    waktu_selesai,
    status_lelang,
    no_lot,
    kondisi_mesin,
    kondisi_exterior,
    kondisi_interior,
    model_produk,
    tahun_produk,
    transmisi,
    no_rangka,
    no_mesin,
    merk_produk,
    kapasitas_mesin,
    odometer,
    catatan,
    no_polisi,
    warna,
    stnk,
    exp_stnk,
    faktur,
    ktp,
    kwitansi,
    form_A,
    sph,
    keur,
    bpkb,
  } = req.body;
  const { file } = req;
  const { productId } = req.params;

  if (!isValidObjectId(productId)) return sendError(res, "Invalid Request");

  const product = await ProductModel.findById(productId);
  if (!product) return sendError(res, "Product not found");

  const public_id = product.avatar?.public_id;

  // remove old Image
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok")
      return sendError(res, "Could not remove image from cloud");
  }

  // upload new image
  if (file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { gravity: "face", height: 480, width: 640, crop: "thumb" }
    );

    product.avatar = { url: secure_url, public_id };
  }

  product.no_lot = no_lot;
  product.cabang = cabang;
  product.harga = harga;
  product.kategori = kategori;
  product.tanggal_mulai = tanggal_mulai;
  product.tanggal_selesai = tanggal_selesai;
  product.kondisi_mesin = kondisi_mesin;
  product.kondisi_exterior = kondisi_exterior;
  product.kondisi_interior = kondisi_interior;
  product.merk_produk = merk_produk;
  product.model_produk = model_produk;
  product.tahun_produk = tahun_produk;
  product.transmisi = transmisi;
  product.no_rangka = no_rangka;
  product.no_mesin = no_mesin;
  product.kapasitas_mesin = kapasitas_mesin;
  product.odometer = odometer;
  product.catatan = catatan;
  product.no_polisi = no_polisi;
  product.warna = warna;
  product.stnk = stnk;
  product.exp_stnk = exp_stnk;
  product.faktur = faktur;
  product.ktp = ktp;
  product.kwitansi = kwitansi;
  product.form_A = form_A;
  product.sph = sph;
  product.keur = keur;
  product.bpkb = bpkb;
  product.waktu_mulai = waktu_mulai;
  product.waktu_selesai = waktu_selesai;
  product.status_produk = status_produk;

  await product.save();

  res.status(201).json({
    id: product._id,
    cabang,
    harga,
    kategori,
    status_produk,
    tanggal_mulai,
    tanggal_selesai,
    waktu_mulai,
    waktu_selesai,
    status_lelang,
    no_lot,
    kondisi_mesin,
    kondisi_exterior,
    kondisi_interior,
    model_produk,
    tahun_produk,
    transmisi,
    no_rangka,
    no_mesin,
    merk_produk,
    kapasitas_mesin,
    odometer,
    catatan,
    no_polisi,
    warna,
    stnk,
    exp_stnk,
    faktur,
    ktp,
    kwitansi,
    form_A,
    sph,
    keur,
    bpkb,
    avatar: product.avatar?.url,
  });
};

exports.removeProduct = async (req, res) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) return sendError(res, "Invalid Request");

  const product = await ProductModel.findById(productId);
  if (!product) return sendError(res, "Product not found");

  const public_id = product.avatar?.public_id;

  // remove Image from cloud
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok")
      return sendError(res, "Could not remove image from cloud");
  }

  await ProductModel.findByIdAndDelete(productId);

  res.status(200).json({ message: "Product deleted successfully" });
};

exports.getAllProducts = async (req, res) => {
  const result = await ProductModel.find().sort({ createdAt: -1 }).limit(10);

  res.status(200).json(result);
};

exports.getProductById = async (req, res) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) return sendError(res, "Invalid Request");

  const product = await ProductModel.findById(productId);

  if (!product) return sendError(res, "Product not found", 404);

  res.json(product);
};

exports.searchProduct = async (req, res) => {
  const { query } = req;

  const result = await ProductModel.find({
    $text: { $search: `"${query.model_produk}"` },
  });

  res.status(200).json(result);
};

exports.bidProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    const product = await ProductModel.findById(id);

    const { nominal_bid } = req.body;

    const newBid = {
      nominal_bid,
      user,
    };

    product.bids.unshift(newBid);

    await product.save();

    res.json(product.bids);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
